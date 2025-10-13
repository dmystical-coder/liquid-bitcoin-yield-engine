import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import useAppStore from "../store/useAppStore";
import {
  User,
  Shield,
  TrendingUp,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Settings,
  Wallet,
  Link,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Book,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import ResponsiveContainer from "../components/ResponsiveContainer";

type ScreenType = 'main' | 'profile' | 'security' | 'wallets' | 'transactions' | 'help';

export default function MoreScreen() {
  const {
    isMoreScreenOpen,
    setMoreScreenOpen,
    setYieldStrategiesModalOpen,
    logout,
    yieldInfo,
    user,
    linkWebWallet,
    recentDemoTransactions,
    dashboardData,
    setLinkWalletModalOpen,
  } = useAppStore();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const walletStatus = useMemo(() => {
    if (!user.isAuthenticated) return 'Not signed in';
    if (!user.address) return 'Managed account (no wallet linked)';
    switch (user.walletType) {
      case 'xverse': return 'Linked: Xverse Wallet';
      case 'unisat': return 'Linked: Unisat Wallet';
      default: return 'Managed account';
    }
  }, [user]);

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => setCurrentScreen('profile'),
    },
    {
      icon: Shield,
      label: "Security",
      onClick: () => setCurrentScreen('security'),
    },
    {
      icon: Wallet,
      label: "Linked Accounts & Wallets",
      subtitle: walletStatus,
      onClick: () => setCurrentScreen('wallets'),
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
      onClick: () => setCurrentScreen('transactions'),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => setCurrentScreen('help'),
    },
  ];

  const handleClose = () => {
    setMoreScreenOpen(false);
    setCurrentScreen('main');
    useAppStore.getState().setActiveTab("Home");
  };

  const handleBack = () => {
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'profile': return 'Profile';
      case 'security': return 'Security';
      case 'wallets': return 'Linked Accounts & Wallets';
      case 'transactions': return 'Transaction History';
      case 'help': return 'Help & Support';
      default: return 'More';
    }
  };

  return (
    <Modal isOpen={isMoreScreenOpen} onClose={handleClose} title={getScreenTitle()}>
      <ResponsiveContainer className="flex flex-col gap-4">

        {/* Back Button for Sub-Screens */}
        {currentScreen !== 'main' && (
          <Button
            variant="secondary"
            onClick={handleBack}
            className="!justify-start w-fit"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back
          </Button>
        )}

        {/* Main Menu Screen */}
        {currentScreen === 'main' && (
          <div className="flex flex-col gap-2">
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
          </div>
        )}

        {/* Profile Screen */}
        {currentScreen === 'profile' && (
          <div className="flex flex-col gap-6">
            {/* User Info */}
            <div className="p-6 bg-[rgb(25,25,35)] rounded-[16px] border border-[rgb(45,45,55)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(0,122,255)] to-[rgb(48,209,88)] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="heading-3 text-primary">{user.id || 'Anonymous User'}</h3>
                  <p className="body-secondary text-secondary">
                    {user.authMethod === 'social' ? 'Google Account' :
                      user.authMethod === 'passkey' ? 'Passkey Account' :
                        'Bitcoin Wallet'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[rgb(10,10,15)] rounded-[12px]">
                  <p className="body-secondary text-secondary mb-1">Total Balance</p>
                  <p className="body-primary text-primary">${dashboardData?.totalBalance || '0.00'}</p>
                </div>
                <div className="p-3 bg-[rgb(10,10,15)] rounded-[12px]">
                  <p className="body-secondary text-secondary mb-1">Yield Earned</p>
                  <p className="body-primary text-[rgb(48,209,88)]">${dashboardData?.totalYieldEarned || '0.00'}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="flex flex-col gap-4">
              <h4 className="heading-4 text-primary">Account Details</h4>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="body-secondary text-secondary">Account ID</span>
                  <button
                    onClick={() => handleCopy(user.id || 'N/A')}
                    className="text-[rgb(0,122,255)] hover:underline"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="body-primary text-primary font-mono text-sm">{user.id || 'N/A'}</p>
              </div>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <p className="body-secondary text-secondary mb-2">Authentication Method</p>
                <p className="body-primary text-primary capitalize">{user.authMethod || 'None'}</p>
              </div>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <p className="body-secondary text-secondary mb-2">Starknet Address</p>
                <div className="flex justify-between items-center">
                  <p className="body-primary text-primary font-mono text-sm break-all mr-2">
                    {user.address || 'Not available'}
                  </p>
                  {user.address && (
                    <button
                      onClick={() => handleCopy(user.address!)}
                      className="text-[rgb(0,122,255)] hover:underline whitespace-nowrap"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Screen */}
        {currentScreen === 'security' && (
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-[rgb(0,122,255)]/10 rounded-[12px] border border-[rgb(0,122,255)]/20">
              <p className="body-secondary text-secondary">
                Your account is secured with {user.authMethod === 'passkey' ? 'WebAuthn passkeys' : 'OAuth authentication'}.
                All transactions require your explicit approval.
              </p>
            </div>

            {/* Security Settings */}
            <div className="flex flex-col gap-4">
              <h4 className="heading-4 text-primary">Security Settings</h4>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="body-primary text-primary">Private Key Access</p>
                    <p className="body-secondary text-secondary">View your managed account private key</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPrivateKey ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showPrivateKey && (
                  <div className="mt-4 p-3 bg-[rgb(255,69,58)]/10 rounded-[8px] border border-[rgb(255,69,58)]/20">
                    <p className="body-secondary text-[rgb(255,69,58)] mb-2">⚠️ Demo Private Key (Not Real)</p>
                    <p className="font-mono text-sm text-primary break-all">
                      0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="body-primary text-primary">Two-Factor Authentication</p>
                    <p className="body-secondary text-secondary">Add extra security to your account</p>
                  </div>
                  <span className="body-secondary text-[rgb(48,209,88)]">Enabled</span>
                </div>
              </div>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="body-primary text-primary">Session Management</p>
                    <p className="body-secondary text-secondary">Manage active sessions</p>
                  </div>
                  <Button variant="secondary">
                    <Settings className="w-4 h-4" strokeWidth={1.5} />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallets Screen */}
        {currentScreen === 'wallets' && (
          <div className="flex flex-col gap-6">
            {/* Current Wallet Status */}
            <div className="p-4 bg-[rgb(25,25,35)] rounded-[16px] border border-[rgb(45,45,55)]">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-[rgb(0,122,255)]" strokeWidth={1.5} />
                <h3 className="heading-3 text-primary">Connected Wallets</h3>
              </div>

              <div className="p-3 bg-[rgb(10,10,15)] rounded-[12px] mb-4">
                <p className="body-secondary text-secondary mb-1">Status</p>
                <p className="body-primary text-primary">{walletStatus}</p>
              </div>

              {user.walletType ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-[rgb(48,209,88)]/10 rounded-[12px] border border-[rgb(48,209,88)]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4 text-[rgb(48,209,88)]" strokeWidth={2} />
                      <p className="body-primary text-[rgb(48,209,88)]">
                        {user.walletType === 'xverse' ? 'Xverse Wallet' : 'Bitcoin Wallet'} Connected
                      </p>
                    </div>
                    <p className="body-secondary text-secondary">
                      Your Bitcoin wallet is linked and ready for transactions
                    </p>
                  </div>

                  <Button variant="secondary" className="w-full">
                    <Link className="w-4 h-4" strokeWidth={1.5} />
                    Manage Connection
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-[rgb(255,159,10)]/10 rounded-[12px] border border-[rgb(255,159,10)]/20">
                    <p className="body-primary text-[rgb(255,159,10)] mb-1">No Wallet Linked</p>
                    <p className="body-secondary text-secondary">
                      Link a Bitcoin wallet for enhanced features
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => setLinkWalletModalOpen(true)}
                    className="w-full"
                  >
                    <Link className="w-4 h-4" strokeWidth={1.5} />
                    Link Bitcoin Wallet
                  </Button>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="flex flex-col gap-4">
              <h4 className="heading-4 text-primary">Account Information</h4>

              <div className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="body-secondary text-secondary">Starknet Address</span>
                  <button
                    onClick={() => handleCopy(user.address || '')}
                    className="flex items-center gap-1 text-[rgb(0,122,255)] hover:underline"
                  >
                    <Copy className="w-3 h-3" strokeWidth={1.5} />
                    Copy
                  </button>
                </div>
                <p className="body-primary text-primary font-mono text-sm break-all">
                  {user.address || 'Not available'}
                </p>
              </div>

              <Button variant="secondary" className="w-full">
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                View on StarkScan
              </Button>
            </div>
          </div>
        )}

        {/* Transaction History Screen */}
        {currentScreen === 'transactions' && (
          <div className="flex flex-col gap-6">
            {/* Search and Filter */}
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
              />

              <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'deposit', 'withdraw', 'yield_claim', 'lightning_payment', 'bridge'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedFilter === filter
                        ? 'bg-[rgb(0,122,255)] text-white'
                        : 'bg-[rgb(25,25,35)] text-secondary hover:bg-[rgb(35,35,45)]'
                      }`}
                  >
                    {filter === 'all' ? 'All' : filter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            <div className="flex flex-col gap-3">
              {recentDemoTransactions
                .filter(tx =>
                  selectedFilter === 'all' || tx.type === selectedFilter
                )
                .filter(tx =>
                  !searchQuery ||
                  tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tx.amount.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 20)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)] hover:bg-[rgb(35,35,45)] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="body-primary text-primary mb-1">{tx.description}</p>
                        <p className="body-secondary text-secondary text-sm">
                          {new Date(tx.timestamp).toLocaleDateString()} • {tx.protocol || tx.token}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="body-primary text-primary">
                          {tx.type === 'withdraw' || tx.type === 'lightning_payment' ? '-' : '+'}{tx.amount} {tx.token}
                        </p>
                        <p className={`body-secondary text-sm capitalize ${tx.status === 'confirmed' ? 'text-[rgb(48,209,88)]' :
                            tx.status === 'pending' ? 'text-[rgb(255,159,10)]' :
                              'text-[rgb(255,69,58)]'
                          }`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>

                    {tx.txHash && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgb(45,45,55)]">
                        <p className="body-secondary text-secondary font-mono text-xs">
                          {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                        </p>
                        <button
                          onClick={() => handleCopy(tx.txHash!)}
                          className="text-[rgb(0,122,255)] hover:underline text-sm"
                        >
                          Copy Hash
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {recentDemoTransactions.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-secondary mx-auto mb-3" strokeWidth={1} />
                  <p className="body-primary text-secondary">No transactions yet</p>
                  <p className="body-secondary text-secondary">Start by adding funds to see your transaction history</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help & Support Screen */}
        {currentScreen === 'help' && (
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="flex flex-col items-center gap-2 h-auto py-4">
                <Book className="w-6 h-6 text-[rgb(0,122,255)]" strokeWidth={1.5} />
                <span className="text-sm">User Guide</span>
              </Button>

              <Button variant="secondary" className="flex flex-col items-center gap-2 h-auto py-4">
                <MessageSquare className="w-6 h-6 text-[rgb(0,122,255)]" strokeWidth={1.5} />
                <span className="text-sm">Live Chat</span>
              </Button>
            </div>

            {/* FAQ Section */}
            <div className="flex flex-col gap-4">
              <h4 className="heading-4 text-primary">Frequently Asked Questions</h4>

              {[
                {
                  question: "How do I add Bitcoin to my account?",
                  answer: "Use the 'Add Funds' button to get a deposit address. Send Bitcoin to bridge it to Starknet USDC for yield farming."
                },
                {
                  question: "What yield strategies are available?",
                  answer: "We offer Vesu lending, Nostra LP farming, Ekubo concentrated liquidity, and other DeFi protocols on Starknet."
                },
                {
                  question: "How do Lightning payments work?",
                  answer: "You can pay Lightning invoices directly from your USDC balance. The app handles the conversion automatically."
                },
                {
                  question: "Is my Bitcoin safe?",
                  answer: "Your funds are secured by Starknet's account abstraction and can only be moved with your explicit approval."
                }
              ].map((faq, index) => (
                <div key={index} className="p-4 bg-[rgb(25,25,35)] rounded-[12px] border border-[rgb(45,45,55)]">
                  <p className="body-primary text-primary mb-2">{faq.question}</p>
                  <p className="body-secondary text-secondary">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-4">
              <h4 className="heading-4 text-primary">Contact Support</h4>

              <div className="flex flex-col gap-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  Email: support@bitcoinyield.app
                </Button>

                <Button variant="secondary" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  Discord Community
                </Button>

                <Button variant="secondary" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  Documentation
                </Button>
              </div>
            </div>

            {/* App Info */}
            <div className="p-4 bg-[rgb(10,10,15)] rounded-[12px] border border-[rgb(45,45,55)]">
              <p className="body-secondary text-secondary mb-1">App Version</p>
              <p className="body-primary text-primary">1.0.0 (Demo)</p>
              <p className="body-secondary text-secondary text-xs mt-2">
                Built with Starknet Account Abstraction, Sats Connect, and Atomiq Bridge
              </p>
            </div>
          </div>
        )}

      </ResponsiveContainer>
    </Modal>
  );
}
