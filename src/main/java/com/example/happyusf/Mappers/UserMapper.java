package com.example.happyusf.Mappers;

import com.example.happyusf.Domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserMapper {

      @Select("SELECT * FROM user_info")
      List<User> getAllUserList();

      @Select("SELECT * FROM user_info WHERE user_id = #{user_id} AND password = #{password}")
      User loginService(User user);
}
