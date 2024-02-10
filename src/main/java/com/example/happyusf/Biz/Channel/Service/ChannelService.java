package com.example.happyusf.Biz.Channel.Service;

import com.example.happyusf.Biz.Channel.Domain.ChannelInfoDTO;
import com.example.happyusf.Biz.Common.Domain.CodeInfoDTO;
import com.example.happyusf.Biz.Common.Domain.PagingDTO;
import com.example.happyusf.Mappers.ChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    public int createChannel(ChannelInfoDTO channelInfo) {
        return channelRepository.createChannel(channelInfo);
    }

    public ArrayList<ChannelInfoDTO> getChannelList(PagingDTO pagingDTO){
        return channelRepository.getChannelList(pagingDTO);
    }

    public ArrayList<ChannelInfoDTO> getMyChannleList(String master){
        return channelRepository.getMyChannelList(master);
    }

    public ArrayList<CodeInfoDTO> getGameList( ){
        return channelRepository.getGameList();
    }

    public int getTotalChannelCount(){
        return channelRepository.getTotalChannelCount();
    }

    public int updateChannelStatus(ChannelInfoDTO channelInfo){
        return channelRepository.updateChannelStatus(channelInfo);
    }

    public ChannelInfoDTO getChannelInfo(String channel_id) {
        return channelRepository.getChannelInfo(channel_id);
    }

    public boolean checkingChannelAccess(ChannelInfoDTO channelInfo){
        boolean result = false;
        if(channelRepository.checkingChannelPW(channelInfo) > 0){
            result = true;
        }
        return result;
    }
}

