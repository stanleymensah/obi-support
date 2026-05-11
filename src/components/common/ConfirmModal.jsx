import Modal from "./Modal"
import { useState, useMemo } from "react"

function shortenId(id = "") {
  return id.toString().slice(0, 7);
}

export default function ConfirmModal({title, onClose, message, onCancel, onApprove, approve, confirmId}) {
  const [input, setInput] = useState("");

  const expected = useMemo(() => shortenId(confirmId), [confirmId]);

  const requiresConfirmation = !!confirmId;

  const matched = !requiresConfirmation || input.trim() === expected;

  return (
    <>
        <Modal title={title} onClose={onClose}>
            <div className="flex flex-col gap-3">
                <span>{message}</span>

                {requiresConfirmation && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-600">Please type <strong>{expected}</strong> to confirm.</span>
                    <input
                      className="border px-2 py-1 text-sm"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={expected}
                    />
                  </div>
                )}

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
                    disabled={!matched}
                    className={`py-1 border px-2 text-xs rounded-sm ${matched ? "bg-azure-pop text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >
                    {approve}
                  </button>
                </div>
            </div>
        </Modal>
    </>
  )
}
