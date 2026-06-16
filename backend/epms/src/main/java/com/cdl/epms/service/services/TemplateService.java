package com.cdl.epms.service.services;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TemplateService {

    public String processTemplate(String body, Map<String, String> values) {

        if (values == null) return body;

        for (Map.Entry<String, String> entry : values.entrySet()) {
            body = body.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }

        return body;
    }
}