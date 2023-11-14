-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.1.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- happyus 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `happyus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `happyus`;

-- 테이블 happyus.agreement_history 구조 내보내기
CREATE TABLE IF NOT EXISTS `agreement_history` (
  `agreement_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary_key',
  `user_id` varchar(50) NOT NULL DEFAULT '0' COMMENT 'user_id',
  `service_agreement` tinyint(1) NOT NULL DEFAULT 0 COMMENT '서비스 이용약관 동의여부',
  `private_info_agreement` tinyint(1) NOT NULL DEFAULT 0 COMMENT '개인정보 수집 및 이용약관 동의여부',
  `GPS_info_agreement` tinyint(1) NOT NULL DEFAULT 0 COMMENT '위치기반서비스 이용약관 동의여부',
  `promotoin_agreement` tinyint(1) NOT NULL DEFAULT 0 COMMENT '프로모션 정보 수신 동의여부',
  PRIMARY KEY (`agreement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='서비스 이용약관, 개인정보 수집 및 이용 약관, 위치기반서비스 이용약관, 프로모션 정보 수신 동의 이력 테이블\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.common_code_info 구조 내보내기
CREATE TABLE IF NOT EXISTS `common_code_info` (
  `code` varchar(6) NOT NULL COMMENT '코드',
  `code_name_kor` varchar(50) NOT NULL COMMENT '코드명_국문',
  `code_name_eng` varchar(50) NOT NULL COMMENT '코드명_영문',
  `major_code` varchar(8) NOT NULL COMMENT '상위코드',
  `use_yn` varchar(1) NOT NULL COMMENT '사용여부',
  `code_desc` varchar(50) NOT NULL COMMENT '코드 설명',
  `reg_id` varchar(25) DEFAULT 'system' COMMENT '코드 등록자',
  `reg_date` datetime DEFAULT sysdate() COMMENT '코드 등록일시',
  `reg_ip` varchar(39) DEFAULT '0' COMMENT '코드 등록자 ip',
  `mod_id` varchar(25) DEFAULT 'system' COMMENT '코드 수정자',
  `mod_date` datetime DEFAULT sysdate() COMMENT '코드 수정일시',
  `mod_ip` varchar(39) DEFAULT 'system' COMMENT '코드 수정자 ip',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='공통 코드 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.news_pages 구조 내보내기
CREATE TABLE IF NOT EXISTS `news_pages` (
  `news_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Primary key',
  `news_title` varchar(100) NOT NULL DEFAULT '' COMMENT '뉴스 기사 제목',
  `news_desc` mediumtext NOT NULL DEFAULT '' COMMENT '기사 요약문',
  `news_content` mediumtext DEFAULT NULL COMMENT '뉴스 기사 내용',
  `ai_date` timestamp NULL DEFAULT NULL COMMENT 'AI가 요약한 일자',
  `ai_result` mediumtext DEFAULT '' COMMENT 'AI가 요약한 뉴스 내용',
  `url` varchar(2000) DEFAULT '' COMMENT '본문 url 주소',
  `created_date` timestamp NULL DEFAULT NULL COMMENT '기사 작성일',
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.page_resource 구조 내보내기
CREATE TABLE IF NOT EXISTS `page_resource` (
  `resource_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'primary_key',
  `resource_name` varchar(50) NOT NULL DEFAULT '' COMMENT '리소스 명칭',
  `rendering_url` varchar(50) NOT NULL DEFAULT '' COMMENT '해당 리소스 요청 URL',
  `resource` mediumtext NOT NULL DEFAULT '' COMMENT 'HTML 리소스',
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='페이지 렌더링에 필요한 HTML 리소스';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.user_grade 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_grade` (
  `code_user_grade` varchar(2) NOT NULL,
  `grade_name` varchar(20) NOT NULL,
  PRIMARY KEY (`code_user_grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='회원 등급 테이블\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.user_info 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_info` (
  `user_id` varchar(25) NOT NULL DEFAULT '' COMMENT '아이디',
  `password` varchar(500) NOT NULL DEFAULT '' COMMENT '비밀번호',
  `phone_number` varchar(50) NOT NULL DEFAULT '' COMMENT '연락처',
  `birth_date` varchar(50) NOT NULL DEFAULT '' COMMENT '생년월일',
  `email` varchar(200) NOT NULL DEFAULT '' COMMENT '이메일',
  `code_user_grade` varchar(2) NOT NULL DEFAULT 'N1' COMMENT '회원 등급',
  `mobile_authentication` tinyint(1) NOT NULL DEFAULT 1 COMMENT '모바일인증 여부',
  `login_fail_count` tinyint(10) NOT NULL DEFAULT 0 COMMENT '로그인 실패횟수',
  `login_lock` tinyint(1) NOT NULL DEFAULT 0 COMMENT '로그인 차단여부 (로그인 실패횟수 5이상)',
  `reg_date` varchar(50) DEFAULT '' COMMENT '가입일시',
  `is_resign` tinyint(1) DEFAULT 0 COMMENT '탈퇴여부',
  `resign_date` varchar(50) DEFAULT '' COMMENT '탈퇴일자',
  `is_baned` tinyint(1) DEFAULT 0 COMMENT '회원정지 여부',
  `baned_date` varchar(50) DEFAULT '' COMMENT '회원정지 일자',
  `warning_count` smallint(2) DEFAULT 0 COMMENT '경고횟수',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='회원 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.user_profile 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_profile` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL DEFAULT '',
  `nick_name` varchar(50) NOT NULL DEFAULT '',
  `image_url` varchar(50) NOT NULL DEFAULT '',
  `introduction` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`profile_id`),
  KEY `profile_FK` (`user_id`),
  CONSTRAINT `profile_FK` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='유저 프로필 정보\r\n';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.verification_codes 구조 내보내기
CREATE TABLE IF NOT EXISTS `verification_codes` (
  `phone_number` varchar(50) NOT NULL DEFAULT '',
  `sent_code` varchar(50) NOT NULL DEFAULT '',
  `sent_time` timestamp NULL DEFAULT curdate(),
  PRIMARY KEY (`phone_number`,`sent_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 happyus.voice_channel 구조 내보내기
CREATE TABLE IF NOT EXISTS `voice_channel` (
  `c_id` varchar(400) NOT NULL DEFAULT '' COMMENT '채널 ID (PK)',
  `c_title` varchar(20) NOT NULL DEFAULT '' COMMENT '채널명',
  `c_desc` varchar(500) NOT NULL DEFAULT '' COMMENT '채널 소개',
  `c_type` char(10) NOT NULL DEFAULT 'open' COMMENT '채널타입',
  `c_password` varchar(500) NOT NULL DEFAULT '' COMMENT 'private 채널 설정 암호',
  `c_subject` char(50) NOT NULL DEFAULT '' COMMENT '채널 주제(플레이 게임)',
  `c_maxUser` int(11) NOT NULL DEFAULT 0 COMMENT '채널 최대 인원',
  `c_heartCount` int(11) NOT NULL DEFAULT 0 COMMENT '채널 인기지표수',
  `c_isAlive` tinyint(1) NOT NULL DEFAULT 0 COMMENT '채널 활성화 여부',
  `c_master` varchar(25) NOT NULL DEFAULT '' COMMENT '채널 주인',
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='음성 채팅 채널 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
