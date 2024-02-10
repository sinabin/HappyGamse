package com.example.happyusf.Security;

import com.example.happyusf.Biz.User.Domain.UserDTO;
import com.example.happyusf.Mappers.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
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

    public static final int MAX_LOGIN_FAIL_COUNT = 10;

    /**
     * @param user_id
     * @return UserDetilas
     * @throws UsernameNotFoundException
     * @Explain Spring Security 인증에 사용할 수 있도록 UserDetails 객체로 반환
     */

    @Override
    public UserDetails loadUserByUsername(String user_id ) throws UsernameNotFoundException {
        UserDTO user = userRepository.findByUserID(user_id);

        if (user == null) {
            throw new UsernameNotFoundException("존재하지 않는 ID 입니다.");
        } else if (user.getLogin_fail_count() > MAX_LOGIN_FAIL_COUNT) {
            throw new DisabledException("로그인 실패 횟수가 " + MAX_LOGIN_FAIL_COUNT + "회 이상 감지되어 로그인 시도를 할 수 없습니다. 사이트 관리자에게 문의하세요.");
        }

        User.UserBuilder userBuilder = User.withUsername(user.getUser_id());
        userBuilder.password(user.getPassword());
        userBuilder.roles("USER");

        return userBuilder.build();
    }
}
