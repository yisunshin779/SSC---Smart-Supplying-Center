import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerStorefront from "./pages/CustomerStorefront";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import SupplierDashboard from "./pages/SupplierDashboard"; // Mảnh ghép thứ 3 của C2M

function App() {
  return (
    <Router>
      {/* Thanh điều hướng tổng của toàn hệ thống (Bảng điều khiển lúc Demo) */}
      <nav className="bg-slate-900 text-slate-300 p-4 shadow-md flex justify-center gap-12 text-sm font-semibold border-b border-slate-800">
        <Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
          📱 Khách hàng
        </Link>
        <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
          ⚙️ Hệ thống
        </Link>
        <Link to="/supplier" className="hover:text-orange-400 transition-colors flex items-center gap-2">
          🏭 Nhà cung ứng
        </Link>
      </nav>

      {/* Vùng không gian hiển thị của từng phân hệ */}
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<CustomerStorefront />} />
          <Route path="/admin" element={<SystemAdminDashboard />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;