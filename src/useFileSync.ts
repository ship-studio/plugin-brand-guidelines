import { useState, useCallback } from 'react';
import { useShell, useProject, useToast } from './context';
import type { BrandSettings } from './types';
import {
  generateBrandMarkdown,
  buildFileContent,
  djb2Hash,
  extractBetweenMarkers,
  hasBrandData,
} from './markdown';

export type SyncStatus = 'none' | 'not-exported' | 'in-sync' | 'needs-update';

export function useFileSync(
  settings: BrandSettings,
  setLastExportedHash: (hash: string) => void,
) {
  const shell = useShell();
  const project = useProject();
  const showToast = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('none');
  const [exporting, setExporting] = useState(false);

  const checkSync = useCallback(async () => {
    if (!project) {
      setSyncStatus('none');
      return;
    }

    if (!hasBrandData(settings)) {
      setSyncStatus('none');
      return;
    }

    const filePath = `${project.path}/${settings.targetFile}`;
    const exists = await shell.exec('test', ['-f', filePath]);

    if (exists.exit_code !== 0) {
      setSyncStatus(settings.lastExportedHash ? 'needs-update' : 'not-exported');
      return;
    }

    const result = await shell.exec('cat', [filePath]);
    if (result.exit_code !== 0) {
      setSyncStatus('not-exported');
      return;
    }

    const extracted = extractBetweenMarkers(result.stdout);
    if (extracted === null) {
      setSyncStatus(settings.lastExportedHash ? 'needs-update' : 'not-exported');
      return;
    }

    const currentMarkdown = generateBrandMarkdown(settings);
    const fileHash = djb2Hash(extracted);
    const settingsHash = djb2Hash(currentMarkdown);

    if (fileHash === settingsHash) {
      setSyncStatus('in-sync');
    } else {
      setSyncStatus('needs-update');
    }
  }, [project, settings, shell]);

  const exportToFile = useCallback(async () => {
    if (!project) {
      showToast('No project open', 'error');
      return;
    }

    setExporting(true);
    try {
      const brandMarkdown = generateBrandMarkdown(settings);
      if (!brandMarkdown) {
        showToast('No brand data to export', 'error');
        setExporting(false);
        return;
      }

      const filePath = `${project.path}/${settings.targetFile}`;

      // Check if file exists and read it
      let existingContent: string | null = null;
      const exists = await shell.exec('test', ['-f', filePath]);
      if (exists.exit_code === 0) {
        // Check writable
        const writable = await shell.exec('test', ['-w', filePath]);
        if (writable.exit_code !== 0) {
          showToast(`${settings.targetFile} is not writable`, 'error');
          setExporting(false);
          return;
        }
        const readResult = await shell.exec('cat', [filePath]);
        if (readResult.exit_code === 0) {
          existingContent = readResult.stdout;
        }
      }

      const newContent = buildFileContent(existingContent, brandMarkdown);

      // Write using node with base64 to avoid escaping issues
      const encoded = btoa(
        new TextEncoder()
          .encode(newContent)
          .reduce((s, b) => s + String.fromCharCode(b), ''),
      );

      const writeResult = await shell.exec('node', [
        '-e',
        `require("fs").writeFileSync(process.argv[1], Buffer.from(process.argv[2], "base64"))`,
        filePath,
        encoded,
      ]);

      if (writeResult.exit_code !== 0) {
        showToast(`Failed to write ${settings.targetFile}: ${writeResult.stderr}`, 'error');
        setExporting(false);
        return;
      }

      const hash = djb2Hash(brandMarkdown);
      setLastExportedHash(hash);
      setSyncStatus('in-sync');
      showToast(
        `Brand guidelines ${existingContent !== null && extractBetweenMarkers(existingContent) !== null ? 'updated' : 'added'} in ${settings.targetFile}`,
        'success',
      );
    } catch (err) {
      showToast(`Export failed: ${err}`, 'error');
    } finally {
      setExporting(false);
    }
  }, [project, settings, shell, showToast, setLastExportedHash]);

  return { syncStatus, checkSync, exportToFile, exporting };
}
