package com.example.happyusf.Domain;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class User {

    private String user_id;
    private String password;
    private String salt;
    private String user_name;
    private String mobile_number;
    private String birth_date;
    private String email;
    private String code_user_name;
    private boolean mobile_authentication;
    private int login_fail_count;
    private boolean login_lock;
    private String reg_date;
    private boolean is_resign;
    private String resign_date;
    private boolean is_baned;
    private String baned_date;
    private int warning_count;

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getMobile_number() {
        return mobile_number;
    }

    public void setMobile_number(String mobile_number) {
        this.mobile_number = mobile_number;
    }

    public String getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(String birth_date) {
        this.birth_date = birth_date;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode_user_name() {
        return code_user_name;
    }

    public void setCode_user_name(String code_user_name) {
        this.code_user_name = code_user_name;
    }

    public boolean isMobile_authentication() {
        return mobile_authentication;
    }

    public void setMobile_authentication(boolean mobile_authentication) {
        this.mobile_authentication = mobile_authentication;
    }

    public int getLogin_fail_count() {
        return login_fail_count;
    }

    public void setLogin_fail_count(int login_fail_count) {
        this.login_fail_count = login_fail_count;
    }

    public boolean isLogin_lock() {
        return login_lock;
    }

    public void setLogin_lock(boolean login_lock) {
        this.login_lock = login_lock;
    }

    public String getReg_date() {
        return reg_date;
    }

    public void setReg_date(String reg_date) {
        this.reg_date = reg_date;
    }

    public boolean isIs_resign() {
        return is_resign;
    }

    public void setIs_resign(boolean is_resign) {
        this.is_resign = is_resign;
    }

    public String getResign_date() {
        return resign_date;
    }

    public void setResign_date(String resign_date) {
        this.resign_date = resign_date;
    }

    public boolean isIs_baned() {
        return is_baned;
    }

    public void setIs_baned(boolean is_baned) {
        this.is_baned = is_baned;
    }

    public String getBaned_date() {
        return baned_date;
    }

    public void setBaned_date(String baned_date) {
        this.baned_date = baned_date;
    }

    public int getWarning_count() {
        return warning_count;
    }

    public void setWarning_count(int warning_count) {
        this.warning_count = warning_count;
    }
}
