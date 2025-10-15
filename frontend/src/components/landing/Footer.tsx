import { motion } from "framer-motion";
import { Twitter, Instagram } from "lucide-react";
import { useState } from "react";
import InputComponent from "../Input";
import ButtonComponent from "../Button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-primary border-t border-subtle py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-primary mb-4">
            Let's stay in touch!
          </h3>
          <p className="text-secondary mb-6">
            Don't miss out on the latest Xverse news and product updates!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <InputComponent
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              type="email"
              className="flex-1"
            />
            <ButtonComponent onClick={handleSubscribe} variant="primary">
              Subscribe
            </ButtonComponent>
          </div>
          {subscribed && (
            <motion.p
              className="text-success mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Subscription Successful!
            </motion.p>
          )}
        </motion.div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Brand Kit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-4">Discover</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Explore
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Pool
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Bitcoin Wallet
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Stacks Wallet
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Ordinals Wallet
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-action transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-subtle">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a
              href="#"
              className="text-secondary hover:text-action transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-secondary hover:text-action transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-secondary text-sm">
            © 2025 Secret Key Labs Limited
          </p>
        </div>
      </div>
    </footer>
  );
}