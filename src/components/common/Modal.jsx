import { X } from "lucide-react";

export default function Modal({ children, onClose, title, size = false }) {
  const sizeClassMap = {
    sm: "sm:max-w-md",
    md: "sm:max-w-2xl",
    lg: "sm:max-w-3xl",
    xl: "sm:max-w-5xl",
    full: "sm:max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      <div
        className={`relative scale-80 z-10 flex max-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-sm bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] ${sizeClassMap[size] || sizeClassMap.md}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="header flex w-full items-center justify-between rounded-t-sm bg-azure-pop px-3 py-1 text-white">
          <h4 className="font-medium">{title}</h4>
          <button
            className="rounded-sm p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="child flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}
