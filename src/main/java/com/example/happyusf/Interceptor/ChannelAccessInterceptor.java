package com.example.happyusf.Interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

public class ChannelAccessInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        HttpSession session = request.getSession();
        String path = request.getRequestURI();
        String channelId = path.substring(path.lastIndexOf("/") + 1);

        Boolean hasAccess = (Boolean) session.getAttribute(channelId);
        if (hasAccess == null || !hasAccess) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.sendRedirect("/403");
            return false;
        }

        return true;
    }
}
