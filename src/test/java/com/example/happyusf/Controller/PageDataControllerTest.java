package com.example.happyusf.Controller;

import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.UserDTO;
import com.example.happyusf.Service.UserService.UserRepositoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PageDataControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private UserRepositoryService userRepositoryService; // UserRepositoryService를 모의객체(Mock)로 만들어서 사용
                                                                   // 만약 실제 DB까지 상호작용하는 범위의 통합테스트를 하려면
                                                                   // @MockBean대신 @Autowired를 통해서 주입받고 when 구문을 삭제하면됨.
                                                                   // 또한 테스트 동안 실제 DB에 변경이 일어나므로 롤백이 필요하니 클래스에 @Transactional 어노테이션을 붙여야함.
    private UserDTO validUserDto;
    private UserDTO invalidUserDto;

    @BeforeEach //해당 어노테이션이 붙은 메소드는 @Test 메소드 이전에 항상 실행되도록 설정 -> 테스트 환경과 테스트 데이터를 준비하기 위함.
    void setUp() throws Exception {

        // 1. joinNewUser Setting
        validUserDto = new UserDTO();
        validUserDto.setUser_id("testUser");
        validUserDto.setPassword("Test@1234");
        validUserDto.setPhone_number("01021332145");
        validUserDto.setBirth_date("2022-02-09");
        validUserDto.setEmail("sinabin@naver.com");

        invalidUserDto = new UserDTO();
        invalidUserDto.setUser_id("testUser");
        invalidUserDto.setPassword("invalidpassword");

        when(userRepositoryService.joinNewUser(validUserDto)).thenReturn(1);
        when(userRepositoryService.joinNewUser(invalidUserDto)).thenThrow(new IllegalArgumentException("Invalid input"));

        // 2. findIdByMobile
        MessageDTO validNumber = new MessageDTO();
        validNumber.setTo("01036445732");

        UserDTO userDto = new UserDTO();
        userDto.setUser_id("sinabin");
        userDto.setPhone_number("01036445732");
        userDto.setBirth_date("2023-09-01");
        when(userRepositoryService.findIdByMobile(validNumber)).thenReturn(userDto); // Test중에 validNumber를 파라미터로 findIdByMobile()를 호출하면  userDto 객체를 반환하도록 설정한다.
    }

    @Test
    @DisplayName("test_name : 회원가입 처리 - case 1 : 정상처리")
    void registerUser() throws Exception {
        mockMvc.perform(post("/request/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(validUserDto)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("test_name : 회원가입 처리 - case 2 : 유효하지않은 데이터 제출")
    void registerUser_withInvalidInput() throws Exception {
        mockMvc.perform(post("/request/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(invalidUserDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("test_name : 아이디 찾기 - case 1 : 존재하는 phoneNumber")
    void findIdByMobile() throws Exception {
        MessageDTO validNumber = new MessageDTO();
        validNumber.setTo("01036445732");

        mockMvc.perform(post("/request/findIdByMobile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(validNumber)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("test_name : 아이디 찾기 - case 2 : 존재하지 않는 phoneNumber")
    void findIdByMobile_notExistingNumber() throws Exception {
        MessageDTO invalidNumber = new MessageDTO();
        invalidNumber.setTo("01022331212"); // when 설정해준 data setting

        mockMvc.perform(post("/request/findIdByMobile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(invalidNumber)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("test_name : 비밀번호 재설정 - case 1 : 정상처리")
    void resetPasswordByMobile() throws Exception {
        UserDTO userDto = new UserDTO();
        userDto.setUser_id("testUser");
        userDto.setPassword("NewPassword@1234");

        mockMvc.perform(post("/request/resetPasswordByMobile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(userDto)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("test_name : 비밀번호 재설정 - case 2 : 유효하지않은 비밀번호 제출")
    void resetPasswordByMobile_withInvalidPassword() throws Exception {
        UserDTO userDto = new UserDTO();
        userDto.setUser_id("testUser");
        userDto.setPassword("invalidpassword");

        mockMvc.perform(post("/request/resetPasswordByMobile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(userDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(
                        "비밀번호는 최소 하나의 소문자, 대문자, 숫자 및 특수 문자를 포함해야하며 길이가 10 이상이어야 합니다.")));

    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
