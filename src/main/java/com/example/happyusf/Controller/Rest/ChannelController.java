package com.example.happyusf.Controller.Rest;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.NewsPagesDTO;
import com.example.happyusf.Domain.PagingDTO;
import com.example.happyusf.Service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/channel")
public class ChannelController {


    private final ChannelService channelService;

    @Autowired
    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getNewsList
            (@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {

        PagingDTO pagingDTO = new PagingDTO();
        pagingDTO.setPage( (page-1)*10 );
        pagingDTO.setSize(size);

        ArrayList<ChannelInfoDTO> channelList = channelService.getChannelList(pagingDTO);
        int totalCount = channelService.getTotalChannelCount();
        pagingDTO.setTotal_count(totalCount);

        Map<String, Object> response = new HashMap<>();

        response.put("paging", pagingDTO);
        response.put("channelList", channelList);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/create")
    public ResponseEntity<String> createChannel(@RequestBody ChannelInfoDTO channelInfo) {
        try {
            // 채널 생성 서비스 호출
            channelService.createChannel(channelInfo);
            return ResponseEntity.ok("Channel created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating channel.");
        }
    }

}
