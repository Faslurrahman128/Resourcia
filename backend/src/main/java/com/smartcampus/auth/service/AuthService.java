package com.smartcampus.auth.service;

import com.smartcampus.auth.dto.AuthResponse;
import com.smartcampus.auth.dto.LoginRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
