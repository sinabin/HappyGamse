package com.example.happyusf.Biz.Mail.DTO.Service;

import com.example.happyusf.Biz.Mail.DTO.EmailVerificationCodeDTO;
import com.example.happyusf.Mappers.EmailVerificationRepository;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.security.SecureRandom;


@Service
public class EmailService {
    private static final SecureRandom random = new SecureRandom();
    private final JavaMailSender mailSender;
    private final String fromAddress = "testemail@gmail.com";
    private final EmailVerificationRepository emailVerificationRepository;

    public EmailService(JavaMailSender mailSender, EmailVerificationRepository emailVerificationRepository) {
        this.mailSender = mailSender;
        this.emailVerificationRepository = emailVerificationRepository;
    }

    @SneakyThrows
    public ResponseEntity<?> sendVerificationCode(@Valid @RequestBody EmailVerificationCodeDTO EmailVerificationCodeDTO, BindingResult bindingResult) throws MessagingException {
        // 1. 6자리 인증번호 생성
        String code = String.format("%06d", random.nextInt(1000000));
        EmailVerificationCodeDTO.setEmail(EmailVerificationCodeDTO.getEmail());
        EmailVerificationCodeDTO.setSent_code(code);

        // 2. Mail 발송 처리
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromAddress, "HappyGames");
        helper.setTo(EmailVerificationCodeDTO.getEmail());
        helper.setSubject("[HappyGames] 이메일 인증 코드 ");
        helper.setText("인증 코드 : " + code, true);
        mailSender.send(message);

        // 3. 인증코드 발송 내역 DB 저장
        emailVerificationRepository.saveEmailVerificationCode(EmailVerificationCodeDTO);
        return new ResponseEntity<>("해당 이메일로 인증번호가 발송되었습니다.", HttpStatus.OK);
    }
}
