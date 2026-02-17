import { ToolbarButton } from './ToolbarButton';

export const name = 'Brand Guidelines';

export const slots = {
  toolbar: ToolbarButton,
};

export function onActivate() {
  console.log('[brand-guidelines] Plugin activated');
}

export function onDeactivate() {
  console.log('[brand-guidelines] Plugin deactivated');
}
