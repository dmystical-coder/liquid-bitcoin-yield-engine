import OnboardingScreen from "./screens/OnboardingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MoreScreen from "./screens/MoreScreen";
import PayModal from "./modals/PayModal";
import AddFundsModal from "./modals/AddFundsModal";
import YieldStrategiesModal from "./modals/YieldStrategiesModal";
import useAppStore from "./store/useAppStore";

function App() {
  const { user } = useAppStore();

  return (
    <div className="min-h-screen bg-primary">
      {/* Main View - Conditional based on authentication */}
      {!user.isAuthenticated ? <OnboardingScreen /> : <DashboardScreen />}

      {/* Modals - Always rendered but controlled by state */}
      <PayModal />
      <AddFundsModal />
      <MoreScreen />
      <YieldStrategiesModal />
    </div>
  );
}

export default App;
