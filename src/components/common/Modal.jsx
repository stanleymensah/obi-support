import { X } from "lucide-react";

export default function Modal({ children, onClose, title, size, noScroll = false }) {

  const sizeClassMap = {
    sm: "sm:max-w-120",
    md: "sm:max-w-xl md:w-92",
    lg: "sm:max-w-3xl",
    xl: "sm:max-w-5xl",
    full: "sm:max-w-[90vw]",
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      <div
        className={`relative z-10 bg-white rounded-sm ${noScroll ? "max-h-none overflow-visible" : "max-h-[90vh] overflow-y-auto"} pb-4 flex flex-col gap-2 ${sizeClassMap[size] || sizeClassMap.md} `}
        role="dialog"
        aria-modal="true"
      >
        <div className="header w-full flex items-center justify-between bg-azure-pop text-white  rounded-t-sm py-1 px-3">
          <h4 className="font-medium">{title}</h4>
          <button
            className="rounded-sm p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="child flex flex-col py-1 px-3">
            {children}
        </div>
      </div>
    </div>
  );
}
