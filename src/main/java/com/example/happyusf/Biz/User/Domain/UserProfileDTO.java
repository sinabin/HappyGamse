package com.example.happyusf.Biz.User.Domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    int profile_id;
    String user_id;
    String nick_name;
    String image_url;
    String introduction;
}
