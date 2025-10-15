import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  handle: string;
  content: string;
  avatarUrl: string;
}

export default function TestimonialCard({
  name,
  handle,
  content,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-surface p-6 rounded-2xl border border-subtle hover:border-action transition-colors"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="w-12 h-12 rounded-full"
          style={{ width: "48px", height: "48px" }}
        />
        <div>
          <h4 className="font-semibold text-primary">{name}</h4>
          <p className="text-sm text-secondary">{handle}</p>
        </div>
      </div>
      <p className="text-secondary leading-relaxed">{content}</p>
    </motion.div>
  );
}