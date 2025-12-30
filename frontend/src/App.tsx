import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { PlanningPage } from "./pages/PlanningPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <AppLayout
      brand="PROJET"
      navItems={[
        { label: "Home", to: "/" },
        { label: "Planning", to: "/planning" }
      ]}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppLayout>
  );
}
