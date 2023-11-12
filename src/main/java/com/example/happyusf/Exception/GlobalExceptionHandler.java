package com.example.happyusf.Exception;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * @param UserAlreadyExistsException
     * @return "이미 사용중인 아이디입니다."
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    /**
     * @param PhoneNumberAlreadyExistsException
     * @return "이미 등록된 휴대폰 번호입니다."
     */
    @ExceptionHandler(PhoneNumberAlreadyExistsException.class)
    public ResponseEntity<String> handlePhoneNumberAlreadyExistsException(PhoneNumberAlreadyExistsException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e){
        return new ResponseEntity<>("잘못된 인자가 전달되었습니다: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MyBatisSystemException.class)
    public ResponseEntity<String> handleMyBatisSystemException(MyBatisSystemException e){
        return new ResponseEntity<>("데이터베이스 에러가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e){
        return new ResponseEntity<>("서버 내부에서 예기치 못한 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<String> handleRestClientException(RestClientException e) {
        return new ResponseEntity<>("외부 서비스 연결에 실패했습니다: " + e.getMessage(), HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler({UnsupportedEncodingException.class, URISyntaxException.class,
            NoSuchAlgorithmException.class, InvalidKeyException.class})
    public ResponseEntity<String> handleExceptions(Exception e) {
        return new ResponseEntity<>("서버 내부에서 예기치 못한 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<String> handleJsonProcessingException(JsonProcessingException e) {
        return new ResponseEntity<>("잘못된 JSON 형식입니다: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleNullPointerException(NullPointerException e) {
        return new ResponseEntity<>("서버 내부에서 null 참조 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return new ResponseEntity<>("요청 형식이 잘못되었습니다. 필요한 필드를 확인해주세요.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
        return new ResponseEntity<>("잘못된 요청 형식입니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e){
        return new ResponseEntity<>("접근 권한이 없습니다.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<String> handleEmptyResultDataAccessException (EmptyResultDataAccessException  e){
        return new ResponseEntity<>("요청한 리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

}
