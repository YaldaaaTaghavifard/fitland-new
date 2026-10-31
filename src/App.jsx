import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import PlansPage from "./pages/public/PlansPage";
import TrainersPage from "./pages/public/TrainersPage";
import StorePage from "./pages/public/StorePage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import MemberDashboard from "./pages/member/MemberDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { useAuth } from "./context/AuthContext";
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

  const homePath = {
    member: "/member",
    trainer: "/trainer",
    admin: "/admin",
  };

  return (
    <div className="page-container">
      <h1>دسترسی غیرمجاز</h1>
      <p>شما اجازه دسترسی به این بخش را ندارید.</p>
      <a className="primary-button" href={homePath[user?.role] || "/"}>
        بازگشت به پنل خودم
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
        <Route path="/store" element={<StorePage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/member" element={<MemberDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/trainer" element={<TrainerDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route
        path="/member"
        element={<ProtectedRoute allowedRoles={["member"]} />}
      >
        <Route element={<DashboardLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
        </Route>
      </Route>

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
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
        <Route path="/member" element={<DashboardLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="training" element={<MemberTraining />} />
          <Route path="nutrition" element={<MemberNutrition />} />
          <Route path="bookings" element={<MemberBookings />} />
          <Route path="payments" element={<MemberPayments />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
        <Route path="/trainer" element={<DashboardLayout />}>
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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
