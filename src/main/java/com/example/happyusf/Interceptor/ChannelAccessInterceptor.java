package com.example.happyusf.Interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class ChannelAccessInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        HttpSession session = request.getSession();
        String path = request.getRequestURI();
        String channelId = path.substring(path.lastIndexOf("/") + 1);

        Boolean hasAccess = (Boolean) session.getAttribute(channelId);
        if (hasAccess == null || !hasAccess) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        return true;
    }
}
