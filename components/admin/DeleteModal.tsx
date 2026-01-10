'use client';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  productName: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  productName,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#181818] rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <span className="material-icons text-red-500">warning</span>
          </div>
          <h3 className="text-xl font-semibold text-white">Delete Product</h3>
        </div>

        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-white">{productName}</strong>?
          This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="material-icons animate-spin">refresh</span>
                Deleting...
              </>
            ) : (
              <>
                <span className="material-icons">delete</span>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
