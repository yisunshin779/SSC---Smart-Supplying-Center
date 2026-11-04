package com.ssc.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Product_Template")
@Data
public class ProductTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Template_ID")
    private Integer templateId;
    @Column(name = "Template_Name")
    private String templateName;
    @Column(name = "Category")
    private String category;
    @Column(name = "Base_Specs")
    private String baseSpecs;
    @Column(name = "Created_At", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}