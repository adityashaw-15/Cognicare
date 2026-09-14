package com.jarvis.repository;

import java.util.List;

import com.jarvis.entity.MemoryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoryCategoryRepository extends JpaRepository<MemoryCategory, String> {
    List<MemoryCategory> findByPatientIdOrderByName(String patientId);
}

