package com.example.happyusf.Controller.Rest;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.PagingDTO;
import com.example.happyusf.Service.ChannelService;
import com.example.happyusf.WebSocket.CustomWebSocketHandler;
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
    private final CustomWebSocketHandler webSocketHandler;

    @Autowired
    public ChannelController(ChannelService channelService, CustomWebSocketHandler webSocketHandler) {
        this.channelService = channelService;
        this.webSocketHandler = webSocketHandler;
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

    @PostMapping("/userCount")
    public Map<String, Integer> getChannelUserCount(@RequestBody  Map<String, List<String>> payload){
        Map<String, Integer> result = new HashMap<>();
        List<String> channelIds = payload.get("channelIds");
        for (String channelId : channelIds) {
            result.put(channelId, webSocketHandler.getChannelUserCount(channelId));
        }
        return result;
    }

}
