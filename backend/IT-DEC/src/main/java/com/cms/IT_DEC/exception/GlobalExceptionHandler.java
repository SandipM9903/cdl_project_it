package com.cms.IT_DEC.exception;

import com.cms.IT_DEC.util.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseUtil<Object> handleException(Exception ex) {
        return new ResponseUtil<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), false, "internal.server.error", null, ex.getMessage());
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseUtil<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            try {
                errors.put(fieldName,  errorMessage );
            }catch(Exception e){
                errors.put(fieldName, errorMessage);
            }
        });
        return new ResponseUtil<>(HttpStatus.BAD_REQUEST.value(),true,  "validation.error"  ,null ,errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseUtil<Object> handleJsonParseException(HttpMessageNotReadableException ex) {
        return new ResponseUtil<>(HttpStatus.BAD_REQUEST.value(), false,  "validation.invalid.payload" , null, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseUtil<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseUtil<>(HttpStatus.BAD_REQUEST.value(), false,  "Input Error" , null, ex.getMessage());

    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

}
