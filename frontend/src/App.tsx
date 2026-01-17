import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { PlanningPage } from "./pages/PlanningPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main app */}
      <Route
        path="/*"
        element={
          <AppLayout
            brand="PROJET"
            navItems={[
              { label: "Home", to: "/" },
              { label: "Planning", to: "/planning" },
            ]}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/planning" element={<PlanningPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}
