package com.example.happyusf.Mappers;

import com.example.happyusf.Domain.MessageDTO;
import com.example.happyusf.Domain.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserRepository {

      @Select("SELECT * FROM user_info WHERE user_id = #{user_id}")
      UserDTO findByUserID(String user_id);

      @Insert("INSERT INTO user_info (user_id, password, phone_number, birth_date, email, code_user_grade) VALUES (#{user_id}, #{password}, #{phone_number}, #{birth_date}, #{email}, 'N0')")
      int joinNewUser(UserDTO userDTO);

      @Select("SELECT user_id FROM user_info WHERE phone_number = #{to}")
      UserDTO findUserIdByMobile(MessageDTO messageDTO);

      @Update("UPDATE user_info SET password =#{password} WHERE phone_number = #{phone_number}")
      int resetPassword(UserDTO userDTO);

}
