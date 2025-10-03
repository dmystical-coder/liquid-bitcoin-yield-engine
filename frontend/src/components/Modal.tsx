import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = "",
}: ModalProps) {
  const { isDesktop } = useBreakpoint();

  // lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className={`z-50 ${
              isDesktop ? "fixed inset-0 flex items-center justify-center" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={
                isDesktop
                  ? { scale: 0.9, opacity: 0 }
                  : { y: "100%", opacity: 0 }
              }
              animate={
                isDesktop ? { scale: 1, opacity: 1 } : { y: 0, opacity: 1 }
              }
              exit={
                isDesktop
                  ? { scale: 0.9, opacity: 0 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`bg-[rgb(25,25,35)] rounded-[16px] overflow-y-auto max-h-[90vh] w-full ${
                isDesktop ? "max-w-lg" : "fixed inset-x-0 bottom-0"
              } ${className}`}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[rgb(25,25,35)] border-b border-[rgb(45,45,55)] px-6 py-4 flex items-center justify-between rounded-t-[16px]">
                {title && <h2 className="heading-1">{title}</h2>}
                <button
                  onClick={onClose}
                  className="ml-auto p-2 hover:bg-[rgb(35,35,45)] rounded-full transition-colors"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
