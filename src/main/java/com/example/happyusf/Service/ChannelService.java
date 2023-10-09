package com.example.happyusf.Service;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.PagingDTO;
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

    public int getTotalChannelCount(){
        return channelRepository.getTotalChannelCount();
    }
}

