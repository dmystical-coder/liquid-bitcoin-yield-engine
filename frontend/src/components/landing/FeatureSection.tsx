import { motion } from "framer-motion";

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex flex-col ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          } gap-12 items-center`}
        >
          {/* Text Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {title}
            </h2>
            <p className="text-xl text-secondary leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="rounded-2xl shadow-2xl w-full"
              style={{ width: "100%", height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}