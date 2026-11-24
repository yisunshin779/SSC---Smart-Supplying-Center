import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CustomerStorefront from "./pages/CustomerStorefront";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import axiosClient from "./api/axiosClient";

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  ROLE_ADMIN: {
    label: "Admin",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  ROLE_SUPPLIER: {
    label: "Nhà cung ứng",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
  ROLE_CUSTOMER: {
    label: "Khách hàng",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
};

function AppContent() {
  // useLocation() giúp Navbar tự động cập nhật lại trạng thái token mỗi khi chuyển trang
  useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role") || "";
  const roleInfo = ROLE_BADGE[role];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const navLinkClass = (activeColor: string) =>
    ({ isActive }: { isActive: boolean }) =>
      `transition-colors flex items-center gap-2 pb-1 border-b-2 ${
        isActive
          ? `${activeColor} border-current`
          : "text-slate-300 border-transparent hover:text-white"
      }`;

  return (
    <>
      {/* Thanh điều hướng tổng của toàn hệ thống */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-slate-300 py-3.5 px-8 shadow-md flex items-center justify-between text-sm font-semibold border-b border-slate-800">
        <div className="flex items-center gap-10">
          <NavLink to="/" end className={navLinkClass("text-blue-400")}>
            📱 Khách hàng
          </NavLink>

          <NavLink to="/admin" className={navLinkClass("text-emerald-400")}>
            ⚙️ Hệ thống
            {role !== "ROLE_ADMIN" && <span className="text-xs opacity-60">🔒</span>}
          </NavLink>

          <NavLink to="/supplier" className={navLinkClass("text-orange-400")}>
            🏭 Nhà cung ứng
            {role !== "ROLE_SUPPLIER" && role !== "ROLE_ADMIN" && (
              <span className="text-xs opacity-60">🔒</span>
            )}
          </NavLink>
        </div>

        {/* Khu vực trạng thái tài khoản */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-slate-400">
                  Xin chào, <strong className="text-white">{username}</strong>
                </span>
                {roleInfo && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${roleInfo.className}`}
                  >
                    {roleInfo.label}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-3.5 py-1.5 rounded transition-colors cursor-pointer"
              >
                {isLoggingOut ? "Đang thoát..." : "Đăng xuất"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="border border-slate-500 hover:border-white text-slate-200 hover:text-white px-4 py-1.5 rounded transition-colors"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition-colors"
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Vùng không gian hiển thị của từng phân hệ */}
      <main className="min-h-screen bg-slate-50">
        <Routes>
          {/* Chặn truy cập lại trang Login/Register nếu đã đăng nhập */}
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          <Route path="/" element={<CustomerStorefront />} />

          {/* Chỉ cho phép ROLE_ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <SystemAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Cho phép ROLE_SUPPLIER và ROLE_ADMIN */}
          <Route
            path="/supplier"
            element={
              <ProtectedRoute allowedRoles={["ROLE_SUPPLIER", "ROLE_ADMIN"]}>
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Bắt mọi đường dẫn không tồn tại để tránh màn hình trắng */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;