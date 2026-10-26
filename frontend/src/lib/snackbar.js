import { toast } from 'sonner';

/**
 * Universal Snackbar Notification with optional Undo and dismiss capability.
 * @param {string} title - Primary notification headline
 * @param {object} options - Configuration options
 * @param {string} [options.description] - Secondary context details
 * @param {function} [options.onUndo] - Callback invoked when user clicks Undo
 * @param {number} [options.duration] - Display duration in ms (defaults to 4500)
 */
export function showSnackbar(title, options = {}) {
  const { description, onUndo, duration = 4500 } = options;

  return toast(title, {
    description,
    duration,
    action: onUndo
      ? {
          label: 'Undo',
          onClick: () => {
            try {
              onUndo();
              toast('Action undone.', { duration: 2000 });
            } catch (err) {
              console.error('Undo failed:', err);
            }
          },
        }
      : undefined,
  });
}

export default showSnackbar;
