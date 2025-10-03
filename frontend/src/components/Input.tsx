import { motion } from "framer-motion";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  adornment?: React.ReactNode;
  type?: string;
  className?: string;
}

export default function Input({
  value,
  onChange,
  placeholder = "",
  label,
  adornment,
  type = "text",
  className = "",
}: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="body-secondary text-secondary">{label}</label>
      )}
      <div className="relative">
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[rgb(25,25,35)] text-[rgb(245,245,255)] px-4 py-3 rounded-[12px] border border-[rgb(45,45,55)] focus:border-[rgb(0,122,255)] focus:outline-none transition-colors body-primary"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        />
        {adornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {adornment}
          </div>
        )}
      </div>
    </div>
  );
}
