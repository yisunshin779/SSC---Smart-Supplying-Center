package com.ssc.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Order_ID")
    private Integer orderId;

    @Column(name = "Customer_ID")
    private Integer customerId; // Tạm fix cứng khi chưa có module User

    @Column(name = "SKU_ID")
    private Integer skuId; // Khóa ngoại chốt xưởng nào gia công

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Total_Cost")
    private BigDecimal totalCost;

    @Column(name = "Status")
    private String status; // PENDING, IN_PRODUCTION, SHIPPED

    @Column(name = "Created_At", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}