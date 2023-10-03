package com.example.happyusf.Service.UserService;


import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Mappers.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.happyusf.Exception.UserAlreadyExistsException;


@Service
@Transactional
public class UserRepositoryService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserRepositoryService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public int joinNewUser(UserDTO userDTO){

        // ID 중복검사
        UserDTO alreadyExistingUser = userRepository.findByUserID(userDTO.getUser_id());
        if(alreadyExistingUser != null){
            throw new UserAlreadyExistsException("이미 사용중인 아이디입니다.");
        }

        // 패스워드 암호화 저장
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userDTO.setPhone_number(userDTO.getPhone_number().replaceAll("-", ""));
        return userRepository.joinNewUser(userDTO);

    }

    public UserDTO findIdByMobile(MessageDTO messageDTO){
        return userRepository.findUserIdByMobile(messageDTO);
    }

    public int resetPassword(UserDTO userDTO){
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return userRepository.resetPassword(userDTO);
    }

    public UserDTO findByIdByEmail(String email){
        return userRepository.findUserByEmail(email);
    }

}
