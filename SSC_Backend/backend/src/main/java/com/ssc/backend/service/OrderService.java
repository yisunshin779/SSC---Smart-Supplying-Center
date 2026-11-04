package com.ssc.backend.service;

import com.ssc.backend.entity.Order;
import com.ssc.backend.entity.SupplierSKU;
import com.ssc.backend.repository.OrderRepository;
import com.ssc.backend.repository.SupplierSKURepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final SupplierSelectionService supplierSelectionService;
    private final OrderRepository orderRepository;
    private final SupplierSKURepository supplierSKURepository;

    @Transactional
    public Order placeOrder(Integer customerId, Integer templateId, Integer quantity, Integer maxLeadTime) {
        // 1. Chạy thuật toán tìm xưởng tối ưu
        SupplierSKU optimalSupplier = supplierSelectionService.findOptimalSupplier(templateId, quantity, maxLeadTime);

        // 2. Trừ lùi tồn kho và chuyển sang trạng thái đang sản xuất
        optimalSupplier.setAvailableStock(optimalSupplier.getAvailableStock() - quantity);
        optimalSupplier.setInProductionStock(optimalSupplier.getInProductionStock() + quantity);
        supplierSKURepository.save(optimalSupplier);

        // 3. Khởi tạo và lưu đơn hàng
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setSkuId(optimalSupplier.getSkuId());
        order.setQuantity(quantity);
        order.setTotalCost(optimalSupplier.getBaseCost().multiply(BigDecimal.valueOf(quantity)));
        order.setStatus("IN_PRODUCTION");

        return orderRepository.save(order);
    }
}