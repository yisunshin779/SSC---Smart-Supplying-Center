import { useState, useEffect } from "react";
import { getOptimalSupplier, placeOrder } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Cài đặt icon bằng lệnh: npm install lucide-react
import { Cpu, Zap, Box, Clock } from "lucide-react"; 

export default function OrderDashboard() {
  const [templateId, setTemplateId] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(100);
  const [maxLeadTime, setMaxLeadTime] = useState<number>(15);
  
  const [supplier, setSupplier] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Kỹ thuật Debounce: Tự động chạy thuật toán sau khi người dùng ngừng gõ 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await getOptimalSupplier(templateId, quantity, maxLeadTime);
        setSupplier(res.data);
        setMessage("✅ Đã kết nối tự động tới xưởng tối ưu!");
      } catch (error: any) {
        setSupplier(null);
        setMessage("❌ " + (error.response?.data?.message || "Không tìm thấy xưởng đáp ứng đủ tiêu chí."));
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [templateId, quantity, maxLeadTime]);

  const handleOrder = async () => {
    try {
      await placeOrder(1, templateId, quantity, maxLeadTime);
      setMessage("🎉 Hệ thống đã tự động chốt đơn và điều phối sản xuất!");
    } catch (error: any) {
      setMessage("❌ " + (error.response?.data?.message || "Lỗi đặt hàng."));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hệ thống Điều phối C2M Tự động</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột khách hàng - Cấu hình đơn hàng */}
          <Card className="lg:col-span-4 shadow-md border-slate-200">
            <CardHeader className="bg-slate-100/50 border-b">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Cpu className="h-5 w-5 text-slate-500" />
                <span>Nhu cầu Khách hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="templateId" className="text-slate-600 font-semibold">Mã linh kiện (Template ID)</Label>
                <Input id="templateId" type="number" className="bg-white" value={templateId} onChange={(e) => setTemplateId(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-600 font-semibold">Sản lượng yêu cầu</Label>
                <Input id="quantity" type="number" className="bg-white" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLeadTime" className="text-slate-600 font-semibold">Giới hạn giao hàng (Ngày)</Label>
                <Input id="maxLeadTime" type="number" className="bg-white" value={maxLeadTime} onChange={(e) => setMaxLeadTime(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>

          {/* Cột Hệ thống - Xử lý thuật toán */}
          <Card className="lg:col-span-8 shadow-md border-slate-200">
            <CardHeader className="bg-slate-100/50 border-b">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Box className="h-5 w-5 text-slate-500" />
                <span>Trung tâm Xử lý SSC (Thời gian thực)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center p-8 text-slate-500">
                  <Clock className="animate-spin h-6 w-6 mr-2" /> Đang chạy thuật toán quét xưởng...
                </div>
              ) : (
                <>
                  {message && (
                    <div className={`p-4 rounded-lg font-medium border ${message.includes("✅") || message.includes("🎉") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                      {message}
                    </div>
                  )}

                  {supplier && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="font-semibold text-slate-700">Tên Xưởng</TableHead>
                              <TableHead className="font-semibold text-slate-700">Đơn giá</TableHead>
                              <TableHead className="font-semibold text-slate-700">Tồn kho</TableHead>
                              <TableHead className="font-semibold text-slate-700">Thời gian giao</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="bg-white">
                            <TableRow className="hover:bg-slate-50 transition-colors">
                              <TableCell className="font-bold text-blue-700">{supplier.supplierName}</TableCell>
                              <TableCell className="font-medium">{supplier.baseCost.toLocaleString()} VNĐ</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {supplier.availableStock} đơn vị
                                </span>
                              </TableCell>
                              <TableCell>{supplier.leadTimeDays} ngày</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-end">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all" onClick={handleOrder}>
                          Xác nhận Sản xuất
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}