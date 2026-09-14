package com.jarvis.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import com.jarvis.entity.UserAccount;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    public String issueDemoToken(UserAccount user) {
        String value = user.getId() + ":" + user.getRole().name() + ":" + Instant.now().toEpochMilli();
        return "demo." + Base64.getUrlEncoder().withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}

