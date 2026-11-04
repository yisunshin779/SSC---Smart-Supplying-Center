package com.ssc.backend.controller;

import com.ssc.backend.entity.Order;
import com.ssc.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @RequestParam Integer customerId,
            @RequestParam Integer templateId,
            @RequestParam Integer quantity,
            @RequestParam(defaultValue = "30") Integer maxLeadTime) {
        
        try {
            // Gọi tầng Service để thực thi giao dịch đặt hàng và trừ kho
            Order newOrder = orderService.placeOrder(customerId, templateId, quantity, maxLeadTime);
            
            // Trả về mã 201 Created cùng thông tin đơn hàng đã tạo thành công
            return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
            
        } catch (RuntimeException e) {
            // Xử lý thống nhất các lỗi nghiệp vụ (ví dụ: không đủ tồn kho, không tìm thấy xưởng)
            return ResponseEntity.badRequest().body(Map.of(
                "errorCode", "ORDER_FAILED",
                "message", e.getMessage()
            ));
        }
    }
}