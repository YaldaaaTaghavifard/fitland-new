import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import PlansPage from "./pages/public/PlansPage";
import TrainersPage from "./pages/public/TrainersPage";
import ClassesPage from "./pages/public/ClassesPage";
import ClassDetailsPage from "./pages/public/ClassDetailsPage";
import StorePage from "./pages/public/StorePage";
import ProductDetailsPage from "./pages/public/ProductDetailsPage";
import BusinessCasePage from "./pages/public/BusinessCasePage";
import ContactPage from "./pages/public/ContactPage";
import FaqPage from "./pages/public/FaqPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import MemberDashboard from "./pages/member/MemberDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import MemberProfile from "./pages/member/MemberProfile";

import MemberTraining from "./pages/member/MemberTraining";
import MemberNutrition from "./pages/member/MemberNutrition";
import MemberMeasurements from "./pages/member/MemberMeasurements";

import TrainerMembers from "./pages/trainer/TrainerMembers";
import TrainerMemberDetails from "./pages/trainer/TrainerMemberDetails";
import TrainerPlanEditor from "./pages/trainer/TrainerPlanEditor";
import TrainerCalendar from "./pages/trainer/TrainerCalendar";
import TrainerReports from "./pages/trainer/TrainerReports";

import {
  MemberBookings,
  MemberPayments,
} from "./pages/member/MemberWorkspacePages";

function UnauthorizedPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const homePath = {
    member: "/member",
    trainer: "/trainer",
    admin: "/admin",
  };

  return (
    <div className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px", color: "var(--primary)" }}>
        {t("unauthorizedTitle") || "دسترسی غیرمجاز / Unauthorized"}
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
        {t("unauthorizedDesc") || "شما اجازه دسترسی به این بخش را ندارید."}
      </p>
      <a className="primary-button" href={homePath[user?.role] || "/"}>
        {t("returnToPanel") || "بازگشت به پنل / Return"}
      </a>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/classes/:id" element={<ClassDetailsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/store/:id" element={<ProductDetailsPage />} />
        <Route path="/business-case" element={<BusinessCasePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/member"
        element={<ProtectedRoute allowedRoles={["member"]} />}
      >
        <Route element={<DashboardLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="training" element={<MemberTraining />} />
          <Route path="nutrition" element={<MemberNutrition />} />
          <Route path="measurements" element={<MemberMeasurements />} />
          <Route path="bookings" element={<MemberBookings />} />
          <Route path="payments" element={<MemberPayments />} />
        </Route>
      </Route>

      <Route
        path="/trainer"
        element={<ProtectedRoute allowedRoles={["trainer"]} />}
      >
        <Route element={<DashboardLayout />}>
          <Route index element={<TrainerDashboard />} />
          <Route path="members" element={<TrainerMembers />} />
          <Route path="members/:memberId" element={<TrainerMemberDetails />} />
          <Route
            path="members/:memberId/training"
            element={<TrainerPlanEditor type="training" />}
          />
          <Route
            path="members/:memberId/nutrition"
            element={<TrainerPlanEditor type="nutrition" />}
          />
          <Route path="calendar" element={<TrainerCalendar />} />
          <Route path="reports" element={<TrainerReports />} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={["admin"]} />}
      >
        <Route element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard section="users" />} />
          <Route path="memberships" element={<AdminDashboard section="memberships" />} />
          <Route path="products" element={<AdminDashboard section="products" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
