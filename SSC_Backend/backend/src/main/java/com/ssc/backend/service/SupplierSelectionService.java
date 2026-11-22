package com.ssc.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssc.backend.dto.SupplierResponseDTO;
import com.ssc.backend.entity.SupplierSKU;
import com.ssc.backend.repository.SupplierSKURepository;

@Service
public class SupplierSelectionService {

    @Autowired
    private SupplierSKURepository supplierSKURepository;

    // Hàm 1: Trả về Entity gốc (Dùng cho nội bộ Backend như OrderService)
    public SupplierSKU findOptimalSupplierEntity(Integer templateId, int quantity, int maxLeadTime) {
        List<SupplierSKU> candidates = supplierSKURepository.findByTemplateIdOrderByBaseCostAsc(templateId);

        return candidates.stream()
                        .filter(sku -> sku.getAvailableStock() >= quantity && sku.getLeadTimeDays() <= maxLeadTime)
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy xưởng gia công phù hợp."));
        }

    // Hàm 2: Trả về DTO an toàn (Dùng cho Controller đẩy lên React)
    public SupplierResponseDTO findOptimalSupplier(Integer templateId, int quantity, int maxLeadTime) {
        SupplierSKU optimalSupplier = findOptimalSupplierEntity(templateId, quantity, maxLeadTime);

        return new SupplierResponseDTO(
            optimalSupplier.getSupplierName(),
            optimalSupplier.getBaseCost(),
            optimalSupplier.getLeadTimeDays(),
            optimalSupplier.getAvailableStock()
        );
    }
}