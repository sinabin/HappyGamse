package com.example.happyusf.Mappers;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.CodeInfoDTO;
import com.example.happyusf.Domain.PagingDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Mapper
@Repository
public interface ChannelRepository {

    int createChannel(ChannelInfoDTO channelInfoDTO);

    @Select("SELECT * FROM voice_channel WHERE c_isAlive = TRUE ORDER BY c_heartCount DESC LIMIT #{page}, #{size}")
    ArrayList<ChannelInfoDTO> getChannelList(PagingDTO pagingDTO);

    @Select("SELECT * FROM voice_channel WHERE master=#{master}")
    ArrayList<ChannelInfoDTO> getMyChannelList(String master);

    @Select("SELECT count(c_id) FROM voice_channel WHERE c_isAlive = TRUE")
    int getTotalChannelCount();

    @Update("UPDATE voice_channel SET c_isAlive=#{c_isAlive} WHERE c_id=#{c_id}")
    int updateChannelStatus(ChannelInfoDTO channelInfoDTO);

    @Select("SELECT code, code_name_kor FROM common_code_info WHERE major_code ='GCroot'")
    ArrayList<CodeInfoDTO> getGameList();

    @Select("SELECT * FROM voice_channel WHERE c_id = #{channel_id}")
    ChannelInfoDTO getChannelInfo(String channel_id);

    @Select("SELECT count(*) FROM voice_channel WHERE c_id = #{c_id} AND c_password=#{c_password} AND c_type ='private'")
    int checkingChannelPW(ChannelInfoDTO channelInfoDTO);
}
