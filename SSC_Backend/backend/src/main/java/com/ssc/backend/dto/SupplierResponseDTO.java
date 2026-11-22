package com.ssc.backend.dto;

import java.math.BigDecimal;

public class SupplierResponseDTO {
    private String supplierName;
    private BigDecimal baseCost; // Đồng bộ tuyệt đối kiểu BigDecimal với Entity
    private Integer leadTimeDays;
    private Integer availableStock;

    // Constructor mặc định (cần thiết cho quá trình phân giải JSON)
    public SupplierResponseDTO() {
    }

    // Constructor đầy đủ tham số (để Service tạo đối tượng)
    public SupplierResponseDTO(String supplierName, BigDecimal baseCost, Integer leadTimeDays, Integer availableStock) {
        this.supplierName = supplierName;
        this.baseCost = baseCost;
        this.leadTimeDays = leadTimeDays;
        this.availableStock = availableStock;
    }

    // Getters và Setters
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public BigDecimal getBaseCost() { return baseCost; }
    public void setBaseCost(BigDecimal baseCost) { this.baseCost = baseCost; }

    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }

    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
}