type Props = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({ message, onConfirm, onCancel }: Props) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-lg shrink-0">
          ⚠
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Confirm Delete</p>
          <p className="text-xs text-zinc-500 mt-0.5">{message}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
