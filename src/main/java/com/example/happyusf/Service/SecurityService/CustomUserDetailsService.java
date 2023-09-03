package com.example.happyusf.Service.SecurityService;

import com.example.happyusf.Domain.UserVO;
import com.example.happyusf.Mappers.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Autowired
    public CustomUserDetailsService(UserRepository userRepository ){
        this.userRepository = userRepository;
    }

    /**
     * @param user_id
     * @return UserDetilas
     * @throws UsernameNotFoundException
     * @Explain Spring Security 인증에 사용할 수 있도록 UserDetails 객체로 반환
     */

    @Override
    public UserDetails loadUserByUsername(String user_id ) throws UsernameNotFoundException {
        UserVO user = userRepository.findByUserID(user_id);

        if (user == null) {
            throw new UsernameNotFoundException("존재하지 않는 ID 입니다.");
        }

        User.UserBuilder userBuilder = User.withUsername(user.getUser_id());
        userBuilder.password(user.getPassword());
        userBuilder.roles("USER");

        return userBuilder.build();
    }
}
