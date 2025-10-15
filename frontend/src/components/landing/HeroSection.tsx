import { motion } from "framer-motion";
import { Chrome, Star } from "lucide-react";
import ButtonComponent from "../Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The Home of{" "}
            <span className="text-gradient">BitcoinFi</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-8">
            Your key to a Bitcoin future. Buy, hold and trade BTC assets.
            Available on iOS, Android & Chrome on desktop.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <ButtonComponent
              variant="primary"
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-100"
            >
              <Chrome className="w-5 h-5" />
              Download for Chrome
            </ButtonComponent>
            <ButtonComponent
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Open Portfolio
            </ButtonComponent>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[rgb(255,149,0)] text-[rgb(255,149,0)]" />
              ))}
              <Star className="w-4 h-4 fill-[rgb(255,149,0)] text-[rgb(255,149,0)]" style={{ clipPath: "inset(0 50% 0 0)" }} />
            </div>
            <span className="text-secondary">Trusted by 1,700,000+ users</span>
          </div>
        </motion.div>

        {/* Hero Images */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {/* Desktop Mockup */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1634097537825-b446635b2f7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxjcnlwdG9jdXJyZW5jeSUyMGRhc2hib2FyZCUyMGludGVyZmFjZSUyMHNjcmVlbiUyMHdhbGxldHxlbnwwfDB8fHwxNzYwMzkxNzg1fDA&ixlib=rb-4.1.0&q=85"
                alt="Bitcoin wallet desktop interface - Jack B on Unsplash"
                className="rounded-2xl shadow-2xl w-full max-w-2xl"
                style={{ width: "600px", height: "auto" }}
              />
            </div>
            {/* Mobile Mockup */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1595079836075-96bdbbf859d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwYXBwJTIwY3J5cHRvY3VycmVuY3klMjB3YWxsZXR8ZW58MHwxfHx8MTc2MDM5MTc4Nnww&ixlib=rb-4.1.0&q=85"
                alt="Bitcoin wallet mobile app - Markus Winkler on Unsplash"
                className="rounded-2xl shadow-2xl"
                style={{ width: "250px", height: "auto" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}