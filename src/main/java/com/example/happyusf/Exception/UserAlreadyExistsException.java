package com.example.happyusf.Exception;

/**
 * @Explain 중복 ID 예외는 컴파일러가 미리 체크하지 않는 예외이므로 unChecked 예외이다.
 * 따라서 개발자는 해당 예외를 명시적으로 처리하기 위해 RuntimeException 상속하여 사용자 정의 예외를 만들어 처리한다.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
