import { useEffect } from "react";

export function Modal({ children, onClose, label = "Dialog" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0c0c0e] p-6 text-white shadow-2xl"
      >
        {children}
      </section>
    </div>
  );
}
