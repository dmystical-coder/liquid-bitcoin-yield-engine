import { create } from 'zustand';
import { ShieldCheck, Zap, ArrowDown, ArrowUp, KeyRound, Chrome } from 'lucide-react';

// --- 1. STATE MANAGEMENT (Zustand) ---
// Perfect for managing global state like authentication without complex setup.
interface AppState {
  isAuthenticated: boolean;
  userAddress: string | null;
  btcBalance: number;
  login: (address: string) => void;
  logout: () => void;
}

const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userAddress: null,
  btcBalance: 0.25,
  login: (address) => set({ isAuthenticated: true, userAddress: address }),
  logout: () => set({ isAuthenticated: false, userAddress: null }),
}));


// --- 2. CORE APP COMPONENT ---
export default function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isAuthenticated ? <DashboardScreen /> : <LoginScreen />}
      </div>
    </div>
  );
}


// --- 3. SCREEN COMPONENTS ---

const LoginScreen = () => {
  const { login } = useStore();

  const handleSocialLogin = async (provider: 'Google' | 'Apple') => {
    // WEB FLOW:
    // 1. Use a library like '@react-oauth/google' to trigger the popup.
    // 2. On successful login, you'll receive a JWT token from Google/Apple.
    // 3. Send THIS TOKEN to your backend's API endpoint (e.g., POST /auth/social).
    // 4. Your backend verifies the token, finds/creates a user, and returns
    //    a session token for YOUR application.
    // 5. This is where you would also prompt for Passkey creation if it's a new user.
    alert(`Simulating login with ${provider}...`);
    // After backend confirms, you get the user's new AA wallet address
    const userAAWalletAddress = "0x0123...abc"; 
    login(userAAWalletAddress);
  };

  const handleCreatePasskeyAndAccount = async () => {
    // WEB FLOW - This is the core of your "invisible" wallet creation.
    // 1. First, authenticate the user via a social provider (as above).
    // 2. Once authenticated, call this function. It will use the browser's
    //    native WebAuthn API to create a secure passkey.
    //    const credential = await navigator.credentials.create({ publicKey: ... });
    // 3. Extract the public key from the `credential` object.
    // 4. Send this public key AND the social login info to your backend.
    // 5. Your backend (using the auth-service.ts logic) will:
    //    a. Deploy a new AA wallet with the passkey's public key as the owner.
    //    b. Set the social account as a recovery guardian.
    //    c. Save the user record and return the new AA wallet address.
    alert("Simulating Passkey creation and AA wallet deployment...");
    const userAAWalletAddress = "0x0123...cde";
    login(userAAWalletAddress);
  };
  
  const handleXverseConnect = () => {
    // This flow is for existing crypto users.
    // Use a library to connect to the Xverse wallet extension.
    alert("Connecting to Xverse wallet...");
    const xverseWalletAddress = "0x0456...xyz";
    login(xverseWalletAddress);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center">
      <h1 className="text-4xl font-bold text-orange-500 mb-2">Liquid Yield</h1>
      <p className="text-gray-400 mb-8">The easiest way to earn on your Bitcoin.</p>
      
      <AuthButton
        icon={<Chrome size={20} />}
        text="Continue with Google"
        onClick={() => handleSocialLogin('Google')}
      />
      
      {/* This button demonstrates the full "magic" flow */}
      <AuthButton
        icon={<KeyRound size={20} />}
        text="Create Account with Passkey"
        onClick={handleCreatePasskeyAndAccount}
        className="bg-green-600 hover:bg-green-700"
      />

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
       <AuthButton
        icon={<ShieldCheck size={20} />}
        text="Connect Xverse Wallet"
        onClick={handleXverseConnect}
        className="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
};


const DashboardScreen = () => {
  const { userAddress, btcBalance, logout } = useStore();
  const btcPrice = 65000;
  const usdBalance = (btcBalance * btcPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-500">Dashboard</h2>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-white">Logout</button>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">Total Balance</p>
        <p className="text-4xl font-bold tracking-tight">{btcBalance.toFixed(4)} BTC</p>
        <p className="text-lg text-gray-500">{usdBalance}</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <ActionButton icon={<ArrowDown size={20}/>} text="Deposit" />
        <ActionButton icon={<ArrowUp size={20}/>} text="Withdraw" />
      </div>
       <ActionButton icon={<Zap size={20}/>} text="Pay with Lightning" isPrimary={false} />

      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Your Starknet Wallet Address:</p>
        <p className="text-xs font-mono break-all">{userAddress}</p>
      </div>
    </div>
  );
};


// --- 4. UI COMPONENTS ---

const AuthButton = ({ icon, text, onClick, className = '' }: { icon: React.ReactNode, text: string, onClick: () => void, className?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center p-3 my-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${className || 'bg-orange-500 hover:bg-orange-600'}`}
  >
    <span className="mr-3">{icon}</span>
    {text}
  </button>
);

const ActionButton = ({ icon, text, isPrimary = true }: { icon: React.ReactNode, text: string, isPrimary?: boolean }) => (
    <button className={`w-full flex items-center justify-center p-4 rounded-lg font-bold text-lg transition-colors ${isPrimary ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
        <span className="mr-3">{icon}</span>
        {text}
    </button>
);