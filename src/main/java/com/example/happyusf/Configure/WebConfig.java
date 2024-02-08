package com.example.happyusf.Configure;

import com.example.happyusf.Interceptor.ChannelAccessInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * @Explain : Spring Boot에서 항상 index.html(React 앱의 엔트리 포인트)을 제공하도록 설정하여
 *          React Router가 클라이언트 사이드에서 적절하게 컴포넌트를 렌더링 할 수 있도록한다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origin}")
    private String allowedOrigin;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // news 이미지 파일 경로 설정
        registry.addResourceHandler("/imgs/news/**")
                .addResourceLocations("file:/HappyGames/news_imgs/");

        // React routing 설정
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath,
                                                   Resource location) throws IOException, IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        return requestedResource.exists() && requestedResource.isReadable() ?
                                requestedResource : new ClassPathResource("/static/index.html");
                    }
                });
    }

    /**
     * @Explain CORS(Cross-Origin-Resource-Sharing) 설정
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 URL 패턴에 대한 CORS 설정
                .allowedOrigins(allowedOrigin) // 127.0.0.1:8081 의 출처에서의 요청만 허용하도록 처리
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");// 허용 메소드
    }

    /**
     * @Explain Interceptor 설정
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ChannelAccessInterceptor()).addPathPatterns("/friend/channel/**");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/400").setViewName("error_page/400");
        registry.addViewController("/401").setViewName("error_page/401");
        registry.addViewController("/403").setViewName("error_page/403");
        registry.addViewController("/404").setViewName("error_page/404");
        registry.addViewController("/408").setViewName("error_page/408");
        registry.addViewController("/500").setViewName("error_page/500");
        registry.addViewController("/503").setViewName("error_page/503");
    }

    @Bean
    public SpringValidatorAdapter localValidatorFactoryBean() {
        return new LocalValidatorFactoryBean();
    }
}
