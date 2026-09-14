package com.jarvis.repository;

import java.util.List;

import com.jarvis.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByPatientIdOrderByCreatedAtDesc(String patientId);
}

