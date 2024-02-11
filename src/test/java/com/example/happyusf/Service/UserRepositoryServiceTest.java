package com.example.happyusf.Service;


import com.example.happyusf.Biz.User.Domain.UserDTO;
import com.example.happyusf.Mappers.UserRepository;
import com.example.happyusf.Biz.User.Service.UserRepositoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserRepositoryServiceTest {

        @InjectMocks
        private UserRepositoryService userRepositoryService;

        @Mock
        private UserRepository userRepository;

        @BeforeEach
        void setUp() {
            MockitoAnnotations.openMocks(this);
        }

        @Test
        void findByIdByEmail() {
            UserDTO mockUser = new UserDTO();
            mockUser.setEmail("sinabin@naver.com");
            // "sinabin@naver.com"을 파라미터로 받으면 mockUser를 리턴받도록 Setting
            when(userRepository.findUserByEmail("sinabin@naver.com")).thenReturn(mockUser);
            UserDTO user = userRepositoryService.findByIdByEmail("sinabin@naver.com"); // user에는 mockUser가 담김

            assertNotNull(user);
            assertEquals("sinabin@naver.com", user.getEmail());

            verify(userRepository, times(1)).findUserByEmail(anyString());
        }


}
