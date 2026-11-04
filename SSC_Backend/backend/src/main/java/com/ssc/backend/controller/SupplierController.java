package com.ssc.backend.controller;

import com.ssc.backend.entity.SupplierSKU;
import com.ssc.backend.service.SupplierSelectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierSelectionService supplierSelectionService;

    @GetMapping("/optimal")
    public ResponseEntity<?> getOptimalSupplier(
            @RequestParam Integer templateId,
            @RequestParam Integer requiredQuantity,
            @RequestParam(defaultValue = "30") Integer maxLeadTime) {
        
        try {
            // Chuyển giao yêu cầu xuống tầng Service để chạy thuật toán
            SupplierSKU optimalSupplier = supplierSelectionService.findOptimalSupplier(templateId, requiredQuantity, maxLeadTime);
            
            // Trả về mã 200 OK kèm dữ liệu xưởng dạng JSON
            return ResponseEntity.ok(optimalSupplier);
            
        } catch (RuntimeException e) {
            // Đánh chặn lỗi thiếu hàng/quá hạn và trả về mã 400 Bad Request
            return ResponseEntity.badRequest().body(Map.of(
                "errorCode", "SUPPLIER_NOT_FOUND",
                "message", e.getMessage()
            ));
        }
    }
}