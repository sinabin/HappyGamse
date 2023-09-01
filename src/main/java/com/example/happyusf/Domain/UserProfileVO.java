package com.example.happyusf.Domain;

import lombok.Data;

@Data
public class UserProfileVO {
    int profile_id;
    String user_id;
    String nick_name;
    String image_url;
    String introduction;
}
