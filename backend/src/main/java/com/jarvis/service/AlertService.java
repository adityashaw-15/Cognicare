package com.jarvis.service;

import java.util.List;

import com.jarvis.dto.Payloads.AlertPayload;
import com.jarvis.repository.CaregiverAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertService {
    private final CaregiverAlertRepository alerts;

    public AlertService(CaregiverAlertRepository alerts) {
        this.alerts = alerts;
    }

    @Transactional(readOnly = true)
    public List<AlertPayload> list(String patientId) {
        return alerts.findByPatientIdOrderByGeneratedAtDesc(patientId).stream()
                .map(JarvisMapper::alert)
                .toList();
    }
}

