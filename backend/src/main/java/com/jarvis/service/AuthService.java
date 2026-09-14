package com.jarvis.service;

import com.jarvis.dto.Payloads.LoginRequest;
import com.jarvis.dto.Payloads.LoginResponse;
import com.jarvis.entity.Role;
import com.jarvis.entity.UserAccount;
import com.jarvis.exception.ApiException;
import com.jarvis.repository.CaregiverRepository;
import com.jarvis.repository.HealthcareWorkerRepository;
import com.jarvis.repository.PatientRepository;
import com.jarvis.repository.UserAccountRepository;
import com.jarvis.security.PasswordService;
import com.jarvis.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final PatientRepository patients;
    private final CaregiverRepository caregivers;
    private final HealthcareWorkerRepository workers;
    private final PasswordService passwords;
    private final TokenService tokens;

    public AuthService(
            UserAccountRepository users,
            PatientRepository patients,
            CaregiverRepository caregivers,
            HealthcareWorkerRepository workers,
            PasswordService passwords,
            TokenService tokens) {
        this.users = users;
        this.patients = patients;
        this.caregivers = caregivers;
        this.workers = workers;
        this.passwords = passwords;
        this.tokens = tokens;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        UserAccount user = users.findByEmailIgnoreCase(request.email())
                .filter(UserAccount::isActive)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_LOGIN", "Invalid demo account"));
        if (user.getRole() != request.role() || !passwords.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_LOGIN", "Invalid demo account");
        }

        String patientId = null;
        String caregiverId = null;
        String workerId = null;
        if (request.role() == Role.PATIENT) {
            patientId = patients.findAll().stream()
                    .filter(patient -> patient.getUser().getId().equals(user.getId()))
                    .findFirst()
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND", "Patient profile not found"))
                    .getId();
        } else if (request.role() == Role.CAREGIVER) {
            caregiverId = caregivers.findByUserId(user.getId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CAREGIVER_NOT_FOUND", "Caregiver profile not found"))
                    .getId();
        } else if (request.role() == Role.HEALTHCARE_WORKER) {
            workerId = workers.findByUserId(user.getId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "WORKER_NOT_FOUND", "Healthcare profile not found"))
                    .getId();
        }

        return new LoginResponse(tokens.issueDemoToken(user), user.getRole(), user.getId(),
                patientId, caregiverId, workerId, user.getDisplayName());
    }
}

