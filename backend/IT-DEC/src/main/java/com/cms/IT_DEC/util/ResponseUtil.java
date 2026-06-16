package com.cms.IT_DEC.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
@Getter
@Setter
@ToString
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUtil<T> {
    private int status ;
    private Boolean success = true;
    private String message;
    private T data;
    private Object error;
}


