/**
 * Cross-platform file helpers.
 *
 * Ship Studio's shell.exec() spawns commands directly without a shell, so
 * POSIX tools (`test`, `cat`) don't exist on Windows PATH and the host
 * rejects them with "tried to run 'test', but it isn't installed or not on
 * PATH" (ship-studio/ship-studio#423). All file checks/reads go through Node
 * instead — same approach as the fix shipped in plugin-vercel (commit
 * b0a23cc).
 */

import type { PluginContextValue } from './types';

type Shell = PluginContextValue['shell'];
type ExecOptions = { timeout?: number };
type ExecResult = { stdout: string; stderr: string; exit_code: number };

/**
 * Read a UTF-8 file via Node (cross-platform replacement for `cat`).
 * exit_code is 1 when the file is missing, matching `cat` behavior.
 */
export function readFile(shell: Shell, path: string, options?: ExecOptions): Promise<ExecResult> {
  const script = `try{process.stdout.write(require('fs').readFileSync(process.argv[1],'utf8'))}catch(e){process.exit(1)}`;
  return shell.exec('node', ['-e', script, path], options ?? { timeout: 10 });
}

/** File-existence check via Node (cross-platform replacement for `test -f`). */
export async function fileExists(shell: Shell, path: string, options?: ExecOptions): Promise<boolean> {
  const script = `process.exit(require('fs').statSync(process.argv[1],{throwIfNoEntry:false})?.isFile()?0:1)`;
  const result = await shell.exec('node', ['-e', script, path], options ?? { timeout: 10 });
  return result.exit_code === 0;
}

/** File-writability check via Node (cross-platform replacement for `test -w`). */
export async function fileWritable(shell: Shell, path: string, options?: ExecOptions): Promise<boolean> {
  const script = `const fs=require('fs');try{fs.accessSync(process.argv[1],fs.constants.W_OK)}catch(e){process.exit(1)}`;
  const result = await shell.exec('node', ['-e', script, path], options ?? { timeout: 10 });
  return result.exit_code === 0;
}

/**
 * Render an unknown rejection value as a readable message.
 *
 * shell.exec rejections from the host are frequently plain CommandError-shaped
 * objects ({ type, message } / { type, cmd, stderr }), NOT Error instances, so
 * naive `${err}` interpolation prints "[object Object]"
 * (ship-studio/ship-studio#424).
 */
export function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const obj = err as { message?: unknown; stderr?: unknown };
    if (typeof obj.message === 'string' && obj.message.trim()) return obj.message;
    if (typeof obj.stderr === 'string' && obj.stderr.trim()) return obj.stderr;
    try {
      return JSON.stringify(err);
    } catch {
      // fall through
    }
  }
  return String(err);
}
