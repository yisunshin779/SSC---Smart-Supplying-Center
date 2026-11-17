import { useState, useEffect } from "react";
import { getAvailableProducts, placeOrder } from "../services/api"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Clock, ShoppingCart, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function CustomerStorefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Các tham số cấu hình đơn hàng của Khách hàng
  const [quantity, setQuantity] = useState<number>(100);
  const [maxLeadTime, setMaxLeadTime] = useState<number>(15);
  
  // Trạng thái giao diện
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    getAvailableProducts()
      .then((res: any) => {
        setProducts(res.data);
        setIsLoadingProducts(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingProducts(false);
      });
  }, []);

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    setMessage({ type: "info", text: "Hệ thống SSC đang tìm xưởng gia công tối ưu nhất..." });
    
    try {
      await placeOrder(1, selectedProduct.id, quantity, maxLeadTime);
      setMessage({ type: "success", text: "🎉 Đặt hàng thành công! Thuật toán đã chốt xưởng và bắt đầu gia công." });
    } catch (error) {
      setMessage({ type: "error", text: "❌ Rất tiếc, hiện không có xưởng nào đáp ứng được cấu hình và thời gian này." });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
          SSC - Hệ thống cung ứng thông minh các Thiết bị Điện tử
        </h1>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-medium">
          <ShoppingCart className="h-5 w-5" />
          <span>Cổng Khách Hàng</span>
        </div>
      </div>
      
      {isLoadingProducts ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-600">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-medium text-lg">Đang tải danh mục thiết bị từ cơ sở dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {products.map(p => (
            <Card 
              key={p.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedProduct?.id === p.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`} 
              onClick={() => setSelectedProduct(p)}
            >
              <CardHeader className="bg-slate-50/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                    <Package className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">{p.templateName}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedProduct && (
        <Card className="bg-white shadow-xl border-blue-100 border-t-4 border-t-blue-600 animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Bảng cấu hình gia công: <span className="text-blue-700">{selectedProduct.templateName}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Package className="h-4 w-4" /> Số lượng yêu cầu (Đơn vị)
                </label>
                <Input 
                  type="number" 
                  min="1"
                  className="h-12 text-lg font-medium focus-visible:ring-blue-500"
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Giới hạn giao hàng (Ngày)
                </label>
                <div className="flex gap-3">
                  {[7, 15, 30].map((days) => (
                    <Button
                      key={days}
                      variant={maxLeadTime === days ? "default" : "outline"}
                      className={maxLeadTime === days ? "bg-blue-600 h-12 flex-1" : "h-12 flex-1 text-slate-600"}
                      onClick={() => setMaxLeadTime(days)}
                    >
                      {days} ngày
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              size="lg"
              disabled={isOrdering}
              onClick={handlePlaceOrder} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-14 rounded-xl shadow-md transition-all"
            >
              {isOrdering ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
              {isOrdering ? "Hệ thống đang xử lý..." : "Xác nhận Yêu cầu Sản xuất"}
            </Button>

            {message.text && (
              <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 font-medium ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {message.type === 'error' && <AlertCircle className="h-5 w-5" />}
                {message.type === 'info' && <Loader2 className="h-5 w-5 animate-spin" />}
                {message.text}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}