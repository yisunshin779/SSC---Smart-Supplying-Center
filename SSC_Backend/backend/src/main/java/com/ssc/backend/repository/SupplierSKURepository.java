package com.ssc.backend.repository;
import com.ssc.backend.entity.SupplierSKU;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SupplierSKURepository extends JpaRepository<SupplierSKU, Integer> {
    List<SupplierSKU> findByTemplateIdOrderByBaseCostAsc(Integer templateId);
}