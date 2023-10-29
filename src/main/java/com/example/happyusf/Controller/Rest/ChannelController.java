package com.example.happyusf.Controller.Rest;

import com.example.happyusf.Domain.ChannelInfoDTO;
import com.example.happyusf.Domain.PagingDTO;
import com.example.happyusf.Service.ChannelService;
import com.example.happyusf.WebSocket.CustomWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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

    @GetMapping("/MyChannel")
    public ResponseEntity<Map<String, Object>> getNewsList(Authentication authentication) {

        ArrayList<ChannelInfoDTO> myChannelList = channelService.getMyChannleList(authentication.getName());
        Map<String, Object> response = new HashMap<>();

        response.put("channelList", myChannelList);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }


    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createChannel(@RequestBody ChannelInfoDTO channelInfo, Authentication authentication) {
        Map<String, Object> responseBody = new HashMap<>();
        try {
            // 채널 생성 서비스 호출
            channelInfo.setC_id(UUID.randomUUID().toString());
            channelInfo.setC_master(authentication.getName());
            channelInfo.setC_isAlive(false);
            channelInfo.setC_heartCount(0);
            channelService.createChannel(channelInfo);

            responseBody.put("message", "채널이 성공적으로 만들어졌습니다.");
            responseBody.put("c_id", channelInfo.getC_id());
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            responseBody.put("error", "Error creating channel.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
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
