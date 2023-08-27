package com.example.happyusf.Service;

import com.example.happyusf.Domain.User;
import com.example.happyusf.Mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public List<User> getAllUserList() {
        return userMapper.getAllUserList();
    }

    @Override
    public User loginService(User user) {
        return userMapper.loginService(user);
    }
}
