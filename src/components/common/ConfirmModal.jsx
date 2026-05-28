import Modal from "./Modal";
import { useState, useMemo } from "react";

function shortenId(id = "") {
  return id.toString().slice(0, 7);
}

export default function ConfirmModal({title, onClose, message, onCancel, onApprove, approve, confirmId}) {
  const [input, setInput] = useState("");

  // Memoize the expected string to avoid recalculating
  const expected = useMemo(() => shortenId(confirmId), [confirmId]);

  // Trim and check if the input matches the expected ID
  const matched = input.trim() === expected;

  return (
    <Modal title={title} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* The Warning Message */}
        <p className="text-sm text-gray-700">{message}</p>

        <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-sm">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-red-600">
            Critical Confirmation
          </label>
          <span className="text-xs text-gray-600">
            Enter the identifier <strong className="select-all bg-white px-1 border border-red-200">{expected}</strong> below.
          </span>
          <input
            autoFocus // Auto-focuses the cursor immediately
            className="border border-red-200 px-2 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none rounded-xs"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={expected}
          />
        </div>

        <div className="flex items-center w-full justify-end gap-2 mt-2">
          <button
            type="button"
            className="border py-1.5 px-3 text-xs rounded-sm hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={!matched}
            className={`py-1.5 border px-3 text-xs rounded-sm transition-all duration-200 font-medium ${
              matched 
                ? "bg-red-600 border-red-700 text-white shadow-sm hover:bg-red-700" 
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {approve}
          </button>
        </div>
      </div>
    </Modal>
  );
}

