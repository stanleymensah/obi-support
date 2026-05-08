import Modal from "./Modal"

export default function ConfirmModal({title, onClose, message, onCancel, onApprove, approve}) {
  return (
    <>
        <Modal title={title} onClose={onClose}>
            <div className="flex flex-col gap-2">
                <span>{message}</span>

<div className="flex items-center w-full justify-end gap-1">
    <button
                type="button"
                className="border py-1 px-2 text-xs rounded-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
            <button
                type="button"
                onClick={onApprove}
                className="py-1 border px-2 text-xs rounded-sm bg-azure-pop text-white"
              >
                {approve}
            </button>
</div>
            </div>
            
            
        </Modal>
    </>
  )
}
