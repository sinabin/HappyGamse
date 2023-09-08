package com.example.happyusf.Mappers;


import com.example.happyusf.Domain.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface LoginFailureHandle {
    @Update("UPDATE user_info SET login_fail_count = login_fail_count + 1, login_lock = CASE WHEN login_fail_count + 1 >= 5 THEN 1 ELSE login_lock END WHERE user_id = #{user_id}")
    int updateLoginFailCount(UserDTO userDTO);
}
