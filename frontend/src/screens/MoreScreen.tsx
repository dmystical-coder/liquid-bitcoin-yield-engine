import { motion } from "framer-motion";
import Modal from "../components/Modal";
import useAppStore from "../store/useAppStore";
import {
  User,
  Shield,
  TrendingUp,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import ResponsiveContainer from "../components/ResponsiveContainer";

export default function MoreScreen() {
  const {
    isMoreScreenOpen,
    setMoreScreenOpen,
    setYieldStrategiesModalOpen,
    logout,
    yieldInfo,
  } = useAppStore();

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: Shield,
      label: "Security",
      onClick: () => console.log("Security clicked"),
    },
    {
      icon: TrendingUp,
      label: "Yield Strategies",
      subtitle: `Current: ${yieldInfo.currentStrategy}`,
      onClick: () => {
        setYieldStrategiesModalOpen(true);
      },
    },
    {
      icon: FileText,
      label: "Transaction History",
      onClick: () => console.log("History clicked"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => console.log("Help clicked"),
    },
  ];

  const handleClose = () => {
    setMoreScreenOpen(false);
    useAppStore.getState().setActiveTab("Home");
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Modal isOpen={isMoreScreenOpen} onClose={handleClose} title="More">
      <ResponsiveContainer className="flex flex-col gap-2">
        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-4 p-4 bg-[rgb(25,25,35)] hover:bg-[rgb(35,35,45)] rounded-[12px] transition-colors border border-[rgb(45,45,55)] text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-2 bg-[rgb(10,10,15)] rounded-full">
                <Icon className="w-5 h-5 text-action" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="body-primary text-primary">{item.label}</div>
                {item.subtitle && (
                  <div className="body-secondary text-secondary">
                    {item.subtitle}
                  </div>
                )}
              </div>
              <ChevronRight
                className="w-5 h-5 text-secondary"
                strokeWidth={1.5}
              />
            </motion.button>
          );
        })}

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 bg-[rgb(255,69,58)]/10 hover:bg-[rgb(255,69,58)]/20 rounded-[12px] transition-colors border border-[rgb(255,69,58)]/20 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="p-2 bg-[rgb(255,69,58)]/20 rounded-full">
            <LogOut className="w-5 h-5 text-error" strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-left">
            <div className="body-primary text-error">Logout</div>
          </div>
        </motion.button>
      </ResponsiveContainer>
    </Modal>
  );
}
