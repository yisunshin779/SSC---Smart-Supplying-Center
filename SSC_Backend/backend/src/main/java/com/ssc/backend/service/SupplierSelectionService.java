package com.ssc.backend.service;

import com.ssc.backend.entity.SupplierSKU;
import com.ssc.backend.repository.SupplierSKURepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierSelectionService {

    private final SupplierSKURepository supplierSKURepository;

    public SupplierSKU findOptimalSupplier(Integer templateId, Integer requiredQuantity) {
        // 1. Lấy danh sách xưởng gia công mẫu mã này, đã được SQL Server sắp xếp giá từ thấp đến cao
        List<SupplierSKU> suppliers = supplierSKURepository.findByTemplateIdOrderByBaseCostAsc(templateId);

        // 2. Duyệt từ trên xuống, chốt xưởng RẺ NHẤT đáp ứng đủ số lượng tồn kho
        for (SupplierSKU supplier : suppliers) {
            if (supplier.getAvailableStock() >= requiredQuantity && supplier.getLeadTimeDays() <= maxLeadTime) {
                return supplier;
            }
        }
        
        // 3. Ném lỗi nghiệp vụ nếu toàn bộ hệ thống không có xưởng nào đủ năng lực
        throw new RuntimeException("Hệ thống hiện không có xưởng nào đáp ứng đủ số lượng và thời gian giao");
    }
}