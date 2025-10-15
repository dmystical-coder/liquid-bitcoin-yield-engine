import DashboardScreen from "./screens/DashboardScreen";
import MoreScreen from "./screens/MoreScreen";
import PayModal from "./modals/PayModal";
import AddFundsModal from "./modals/AddFundsModal";
import YieldStrategiesModal from "./modals/YieldStrategiesModal";
import LandingPage from "./pages/LandingPage";
import useAppStore from "./store/useAppStore";

function App() {
  const { user } = useAppStore();

  // Show landing page if not authenticated
  if (!user.isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Main View - Show dashboard when authenticated */}
      <DashboardScreen />

      {/* Modals - Always rendered but controlled by state */}
      <PayModal />
      <AddFundsModal />
      <MoreScreen />
      <YieldStrategiesModal />
    </div>
  );
}

export default App;
