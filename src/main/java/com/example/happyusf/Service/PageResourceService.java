package com.example.happyusf.Service;

import com.example.happyusf.Mappers.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PageResourceService {

    private final ResourceRepository resourceRepository;

    @Autowired
    public PageResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public String findPageResource(String resource_name){
        return resourceRepository.findPageResource(resource_name);
    }


}
