import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal, Activity, Database, Server } from "lucide-react";

export default function SystemAdminDashboard() {
  // Trạng thái lưu trữ các dòng log của hệ thống
  const [logs, setLogs] = useState<string[]>([]);

  // Giả lập luồng log khởi động (Sau này sẽ thay bằng API gọi qua WebSocket hoặc Polling)
  useEffect(() => {
    const initialLogs = [
      "[SYSTEM] Khởi động hệ thống SSC...",
      "[DB_CONN] Kết nối Cơ sở dữ liệu: THÀNH CÔNG.",
      "[MODULE] Thuật toán định giá & chọn nhà cung ứng: ĐANG CHẠY.",
      "[LISTEN] Đang chờ tín hiệu đặt hàng từ cổng Khách hàng..."
    ];
    setLogs(initialLogs);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-emerald-400" />
        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">Hệ thống Quản lý (System Admin)</h1>
      </div>

      {/* Hàng 1: Các chỉ số hạ tầng (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-400">Trạng thái CSDL (SQL Server)</CardTitle>
            <Database className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">Đã kết nối</div>
            <p className="text-xs text-slate-500 mt-1">Cổng 1434 | ssc_database</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-400">Độ trễ API (Latency)</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">~ 45ms</div>
            <p className="text-xs text-slate-500 mt-1">Spring Boot (Port 8080)</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-400">Luồng thuật toán</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">Chờ tín hiệu</div>
            <p className="text-xs text-slate-500 mt-1">Sẵn sàng điều phối</p>
          </CardContent>
        </Card>
      </div>

      {/* Hàng 2: Màn hình Terminal giả lập log thuật toán */}
      <Card className="bg-[#0D1117] border-slate-800 shadow-2xl">
        <CardHeader className="border-b border-slate-800 bg-[#161B22]">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-sm font-mono text-slate-300">ssc-pricing-service-logs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 font-mono text-sm leading-relaxed text-emerald-400/90">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-4 hover:bg-slate-800/50 px-2 py-1 rounded transition-colors">
                <span className="text-slate-600 select-none">
                  {new Date().toLocaleTimeString('vi-VN', { hour12: false })}
                </span>
                <span className={log.includes("[ERROR]") ? "text-red-400" : log.includes("[SUCCESS]") ? "text-blue-400" : ""}>
                  {log}
                </span>
              </div>
            ))}
            {/* Con trỏ nhấp nháy tạo cảm giác Terminal thật */}
            <div className="flex gap-4 px-2 py-1 mt-2">
              <span className="text-emerald-400 animate-pulse">_</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}