import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SupplierDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Nhà cung ứng sản phẩm</h1>
      <Card className="bg-white shadow-sm border-orange-200 border-t-4">
        <CardHeader>
          <CardTitle className="text-orange-700">Đơn hàng chờ xác nhận từ SSC</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Đây là nơi các đơn hàng từ SSC được chuyển đến để xưởng xác nhận sản xuất.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}