package com.example.happyusf.Mappers;

import com.example.happyusf.Domain.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserRepository {

      @Select("SELECT * FROM user_info WHERE user_id = #{user_id}")
      UserVO findByUserID(String user_id);
}
