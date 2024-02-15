package com.example.happyusf.Biz.Common.Service;

import com.example.happyusf.Mappers.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Explain PageResourceService 인터페이스의 구현클래스
 */
@Service
public class PageResourceServiceImpl implements PageResourceService{

    private final ResourceRepository resourceRepository;

    @Autowired
    public PageResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }


    @Override
    public String findPageResource(String resource_name){
        return resourceRepository.findPageResource(resource_name);
    }


}
