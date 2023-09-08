package com.example.happyusf.Domain;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class UserDTO {

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{6,25}$", message = "유저 아이디는 6~25자의 영문 대소문자와 숫자로 이루어져야 합니다.")
    private String user_id;

    @NotNull
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,}$",
            message = "비밀번호는 최소 하나의 소문자, 대문자, 숫자 및 특수 문자를 포함해야하며 길이가 10 이상이어야 합니다.")
    private String password;

    private String nick_name;

    @NotNull
    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "전화번호는 XXX-XXXX-XXXX 형식으로 입력해주세요.")
    private String phone_number;

    @NotNull
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "생일은 YYYY-MM-DD 형식으로 입력해주세요.")
    private String birth_date;

    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "올바른 이메일 형식을 입력해주세요.")
    private String email;

    private String code_user_grade;

    private int login_fail_count;

    private boolean login_lock;

    private String reg_date;

    private boolean is_resign;

    private String resign_date;

    private boolean is_baned;

    private String baned_date;

    private int warning_count;
}
