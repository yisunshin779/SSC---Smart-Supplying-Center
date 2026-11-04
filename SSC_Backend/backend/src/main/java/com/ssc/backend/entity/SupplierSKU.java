package com.ssc.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Supplier_SKU")
@Data
public class SupplierSKU {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SKU_ID")
    private Integer skuId;
    @Column(name = "Template_ID")
    private Integer templateId;
    @Column(name = "Supplier_Name")
    private String supplierName;
    @Column(name = "Base_Cost")
    private BigDecimal baseCost;
    @Column(name = "Available_Stock")
    private Integer availableStock;
    @Column(name = "In_Production_Stock")
    private Integer inProductionStock;
    @Column(name = "Lead_Time_Days")
    private Integer leadTimeDays;
    @Column(name = "Last_Updated", insertable = false, updatable = false)
    private LocalDateTime lastUpdated;
}