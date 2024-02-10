package com.example.happyusf.Biz.User.Service;

import com.example.happyusf.Biz.User.Domain.UserDTO;
import com.example.happyusf.Mappers.LoginFailureHandle;
import org.springframework.stereotype.Service;

@Service
public class LoginFailureService {
    private final LoginFailureHandle loginFailureHandle;

    public LoginFailureService(LoginFailureHandle loginFailureHandle) {
        this.loginFailureHandle = loginFailureHandle;
    }

    public int updateLoginFailureCount(UserDTO userDTO){
        return loginFailureHandle.updateLoginFailCount(userDTO);
    }
}
