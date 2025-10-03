import { Home, Zap, PlusCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useBreakpoint } from "../hooks/useBreakpoint";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { isDesktop } = useBreakpoint();
  const tabs = [
    { id: "Home", icon: Home, label: "Home" },
    { id: "Pay", icon: Zap, label: "Pay" },
    { id: "AddFunds", icon: PlusCircle, label: "Add" },
    { id: "More", icon: MoreHorizontal, label: "More" },
  ];

  if (isDesktop) {
    return (
      <motion.aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-20 bg-[rgb(25,25,35)] border-r border-[rgb(45,45,55)] py-6 z-30"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="flex flex-col items-center gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                  isActive ? "text-[rgb(0,122,255)]" : "text-[rgb(160,160,175)]"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
                {isActive && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[rgb(0,122,255)] rounded"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.aside>
    );
  }

  // mobile/tablet
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-[rgb(25,25,35)] border-t border-[rgb(45,45,55)] px-4 py-3 z-30 lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "text-[rgb(0,122,255)]" : "text-[rgb(160,160,175)]"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-xs font-medium">{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[rgb(0,122,255)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
