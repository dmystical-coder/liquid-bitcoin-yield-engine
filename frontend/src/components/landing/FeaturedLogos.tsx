import { motion } from "framer-motion";

const logos = [
  "CoinDesk",
  "Decrypt",
  "Cointelegraph",
  "NFTNOW",
  "Bitcoin Magazine",
  "bitcoin.com",
  "Bankless",
  "TechCrunch",
];

export default function FeaturedLogos() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-center text-secondary text-sm font-semibold mb-8 uppercase tracking-wider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Recently Featured In
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <motion.div
              key={logo}
              className="text-secondary text-lg font-semibold opacity-60 hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}