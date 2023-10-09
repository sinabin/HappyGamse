package com.example.happyusf.Mappers;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.PagingDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Mapper
@Repository
public interface ChannelRepository {

    @Insert("INSERT INTO voice_channel (c_id, c_title, c_type, c_subject, c_maxUser, c_heartCount, c_isAlive, c_master)\n" +
            "VALUES (#{c_id}, #{c_title}, #{c_type}, #{c_subject}, #{c_maxUser}, #{c_heartCount}, #{c_isAlive}, #{c_master})")
    int createChannel(ChannelInfoDTO channelInfoDTO);

    @Select("SELECT * FROM voice_channel ORDER BY c_heartCount DESC LIMIT #{page}, #{size}")
    ArrayList<ChannelInfoDTO> getChannelList(PagingDTO pagingDTO);

    @Select("SELECT count(c_id) FROM voice_channel WHERE c_isAlive = TRUE")
    int getTotalChannelCount();
}
