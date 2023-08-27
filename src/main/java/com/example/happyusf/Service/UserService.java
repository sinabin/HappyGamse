package com.example.happyusf.Service;

import com.example.happyusf.Domain.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<User> getAllUserList();
    User loginService(User user);
}
