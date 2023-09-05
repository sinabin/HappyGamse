package com.example.happyusf.Service.UserService;


import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Mappers.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserRepositoryService {

    private final UserRepository userRepository;

    @Autowired
    public UserRepositoryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public int joinNewUser(UserDTO userDTO){
        // ID 중복검사
        UserDTO alreadyExistingUser = userRepository.findByUserID(userDTO.getUser_id());
        if(alreadyExistingUser != null){
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }
        return userRepository.joinNewUser(userDTO);
    }
}
