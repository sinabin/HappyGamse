package com.example.happyusf.Mappers;

import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Mapper
@Repository
public interface CommunityRepository {
    @Select("SELECT code, code_name_kor FROM common_code_info WHERE major_code ='LMroot'")
    ArrayList<CodeInfoDTO> getCommunityLeftMenuList();

}
