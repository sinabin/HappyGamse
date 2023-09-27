package com.example.happyusf.Utils;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

public class Validator {

    public static void validateRequest(BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            StringBuilder errorMessage = new StringBuilder();
            for(FieldError fieldError : bindingResult.getFieldErrors()){
                errorMessage.append(fieldError.getDefaultMessage());
            }
            throw new IllegalArgumentException(errorMessage.toString());
        }
    }

}
