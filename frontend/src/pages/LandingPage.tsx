import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Rocket,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Network,
  Key,
  Coins,
  BarChart3,
  Github,
  Twitter,
} from "lucide-react";
import Button from "../components/Button";
import { useBitcoinWallet } from "../services/BitcoinWalletProvider";

export default function LandingPage() {
  const { openModal } = useBitcoinWallet();
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-subtle mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="w-4 h-4 text-[rgb(255,149,0)]" />
              <span className="text-sm text-secondary">
                Built for Starknet Resolve Hackathon
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Liquid Bitcoin{" "}
              <span className="text-gradient bg-gradient-to-r from-[rgb(255,149,0)] to-[rgb(255,184,0)] bg-clip-text text-transparent">
                Yield Engine
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-8">
              Earn DeFi yield on your Bitcoin with one click. No seed phrases,
              no gas fees, instant liquidity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                variant="primary"
                onClick={openModal}
                className="w-full sm:w-auto bg-[rgb(255,149,0)] hover:bg-[rgb(255,169,20)] text-black font-semibold px-8 py-4 text-lg"
              >
                Connect Bitcoin Wallet
                <Wallet className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[rgb(48,209,88)]">
                  8-12%
                </div>
                <div className="text-sm text-secondary">APY Range</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-subtle"></div>
              <div>
                <div className="text-3xl font-bold text-primary">$2.5M+</div>
                <div className="text-sm text-secondary">Total Value Locked</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-subtle"></div>
              <div>
                <div className="text-3xl font-bold text-primary">1,200+</div>
                <div className="text-sm text-secondary">Active Users</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgb(255,149,0)] rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(0,122,255)] rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </section>

      {/* Problem Section */}
      <section id="features" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              The Problem with Bitcoin DeFi
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Most Bitcoin sits idle, locked out of productive DeFi. Traditional
              yield farming requires:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Network,
                title: "Multiple Bridges",
                desc: "Complex cross-chain swaps",
              },
              {
                icon: Key,
                title: "Seed Phrases",
                desc: "Managing keys across chains",
              },
              {
                icon: Coins,
                title: "Gas Fees",
                desc: "Paying with non-native tokens",
              },
              {
                icon: BarChart3,
                title: "High Friction",
                desc: "Steep learning curve",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-primary border border-subtle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[rgb(255,69,58)]/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[rgb(255,69,58)]" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              One-Click Bitcoin Yield
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              We abstract away all the complexity. Just Bitcoin in, and
              higher-value Bitcoin out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Wallet,
                title: "Seedless Onboarding",
                desc: "Use passkeys or social login. No seed phrases to manage. Your Starknet smart account is created automatically.",
                color: "rgb(0,122,255)",
              },
              {
                icon: Zap,
                title: "Truly Gasless",
                desc: "Gas fees are sponsored via AVNU paymaster. A tiny portion of your deposit covers all transactions.",
                color: "rgb(255,149,0)",
              },
              {
                icon: Rocket,
                title: "Instant Liquidity",
                desc: "Withdraw directly to Lightning Network anytime. Deep DeFi yield meets instant access.",
                color: "rgb(48,209,88)",
              },
              {
                icon: TrendingUp,
                title: "Automated Strategy",
                desc: "Smart contracts route funds to trusted protocols like Vesu and Troves. Earn 8-12% APY automatically.",
                color: "rgb(255,184,0)",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-surface border border-subtle hover:border-action transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon
                    className="w-8 h-8"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              How It Works
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Four simple steps to start earning yield on your Bitcoin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Key,
                title: "Connect",
                desc: "Sign in with passkey or social login",
              },
              {
                step: "02",
                icon: Wallet,
                title: "Deposit",
                desc: "Send Bitcoin from L1 or Lightning",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Earn",
                desc: "Automatic yield on Starknet protocols",
              },
              {
                step: "04",
                icon: Rocket,
                title: "Withdraw",
                desc: "Instant withdrawal to Lightning",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgb(255,149,0)] to-[rgb(255,184,0)] mb-6">
                    <item.icon className="w-10 h-10 text-black" />
                  </div>
                  <div className="text-6xl font-bold text-[rgb(255,149,0)] opacity-20 mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-secondary">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[rgb(255,149,0)] to-transparent -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yield Strategies */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Yield Strategies
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Choose your risk-reward profile. All strategies are automated and
              optimized.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Standard",
                apy: "8-10%",
                protocols: "Vesu Lending",
                risk: "Low",
                desc: "Conservative lending strategy with stable returns",
              },
              {
                name: "Turbo",
                apy: "10-12%",
                protocols: "Vesu + Troves",
                risk: "Medium",
                desc: "Balanced approach with liquidity provision",
                featured: true,
              },
              {
                name: "Maxi",
                apy: "12-15%",
                protocols: "Multi-Protocol",
                risk: "Higher",
                desc: "Aggressive strategy for maximum yield",
              },
            ].map((strategy, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl border-2 ${
                  strategy.featured
                    ? "border-[rgb(255,149,0)] bg-[rgb(255,149,0)]/5"
                    : "border-subtle bg-surface"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {strategy.featured && (
                  <div className="inline-block px-3 py-1 rounded-full bg-[rgb(255,149,0)] text-black text-sm font-semibold mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {strategy.name}
                </h3>
                <div className="text-4xl font-bold text-[rgb(48,209,88)] mb-4">
                  {strategy.apy}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-[rgb(48,209,88)]" />
                    <span>{strategy.protocols}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Shield className="w-5 h-5 text-action" />
                    <span>{strategy.risk} Risk</span>
                  </div>
                </div>
                <p className="text-secondary mb-6">{strategy.desc}</p>
                <Button
                  variant={strategy.featured ? "primary" : "secondary"}
                  className={
                    strategy.featured
                      ? "w-full bg-[rgb(255,149,0)] hover:bg-[rgb(255,169,20)] text-black"
                      : "w-full"
                  }
                  onClick={openModal}
                >
                  Select Strategy
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Powered by Leading Technology
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Built on battle-tested infrastructure and cutting-edge protocols
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Starknet", desc: "Account Abstraction" },
              { name: "Lightning", desc: "Instant Settlements" },
              { name: "WebAuthn", desc: "Passkey Security" },
              { name: "AVNU", desc: "Gas Sponsorship" },
              { name: "Atomiq", desc: "Bridge Protocol" },
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-primary border border-subtle text-center hover:border-action transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-action/10 flex items-center justify-center mx-auto mb-4">
                  <Network className="w-6 h-6 text-action" />
                </div>
                <h3 className="font-bold text-primary mb-1">{tech.name}</h3>
                <p className="text-sm text-secondary">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary border-t border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-primary mb-2">
                Liquid Bitcoin Yield Engine
              </h3>
              <p className="text-secondary">
                Built for Starknet Resolve Hackathon 2025
              </p>
              <p className="text-sm text-secondary mt-2">
                Tracks: Bitcoin Unleashed • Mobile-First dApps • Next-Gen
                Payments
              </p>
            </div>

            <div className="flex gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-action transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-action transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-subtle text-center text-sm text-secondary">
            <p>© 2025 Liquid Bitcoin Yield Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
