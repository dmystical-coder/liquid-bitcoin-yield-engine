import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StrategyCardProps {
  title: string;
  apyRange: string;
  description: string;
  isActive: boolean;
  onSelect: () => void;
}

export default function StrategyCard({
  title,
  apyRange,
  description,
  isActive,
  onSelect,
}: StrategyCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={`w-full p-5 rounded-[16px] border-2 text-left transition-all ${
        isActive
          ? "border-[rgb(0,122,255)] bg-[rgb(0,122,255)]/10"
          : "border-[rgb(45,45,55)] bg-[rgb(25,25,35)] hover:border-[rgb(60,60,70)]"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="body-primary font-semibold text-primary">{title}</h3>
            <span className="body-secondary text-[rgb(48,209,88)] font-semibold">
              {apyRange}
            </span>
          </div>
          <p className="body-secondary text-secondary">{description}</p>
        </div>

        {/* Checkmark */}
        <motion.div
          initial={false}
          animate={{
            scale: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(0,122,255)] flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      </div>
    </motion.button>
  );
}
