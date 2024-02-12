let isPhoneNumberVerified = false;

function validateInput(inputId, regex) {

    if(inputId==="phone_number"){
        return regex.test(document.getElementById(inputId).value.replaceAll("-", ""));

    }
    return regex.test(document.getElementById(inputId).value);
}


function updateErrorMessage(inputId, message) {
    document.querySelector(`#${inputId} + span`).innerText = message;
}

document.getElementById('user_id').addEventListener('keyup', function () {
    if (!validateInput('user_id', userIdRegex)) {
        updateErrorMessage('user_id', '6~25자의 영문 대소문자와 숫자로 이루어져야 합니다.');
    } else {
        updateErrorMessage('user_id', '');
    }
});

document.getElementById('password').addEventListener('keyup', function () {
    if (!validateInput('password', passwordRegex)) {
        updateErrorMessage(
            'password',
            '최소 하나의 대문자, 소문자, 숫자와 특수 문자(@$!%*?&)을 포함한 10글자 이상이어야 합니다.'
        );
    } else {
        updateErrorMessage('password', '');
    }
});

document.getElementById('confirm_password').addEventListener('keyup', function () {

    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm_password").value;

    if (password !== confirm_password) {
        updateErrorMessage(
            'confirm_password',
            '비밀번호가 일치하지 않습니다.'
        );
    } else {
        updateErrorMessage('confirm_password', '');
    }
});

function checkBirthDate () {
    if (!validateInput("birth_date", birthDateRegex)) {
        updateErrorMessage("birth_date", "생년월일은 YYYY-MM-DD 형태여야 합니다.");
    } else {
        updateErrorMessage("birth_date", "");
    }
}

document.getElementById('birth_date').addEventListener('keyup', checkBirthDate);
document.getElementById('birth_date').addEventListener('change', checkBirthDate);


document.getElementById("phone_number").addEventListener("keyup", function () {
    if (!validateInput("phone_number", phoneNumberRegex)) {
        updateErrorMessage(
            "phone_number",
            "유효한 핸드폰 번호가 아닙니다."
        );
    } else {
        updateErrorMessage("phone_number", "");
        document.getElementById("btn_requestCode").style.backgroundColor = "#6d5dfc";
        document.getElementById("btn_requestCode").style.cursor = "pointer";
        document.getElementById("btn_requestCode").disabled = false;
    }
});

document.getElementById("email").addEventListener("keyup", function () {
    if (!validateInput("email", emailRegex)) {
        updateErrorMessage(
            "email",
            "올바른 이메일 형식이 아닙니다.."
        );
    } else {
        updateErrorMessage("email", "");
    }
});

const verified_code = document.getElementById("verified_code");
document.getElementById("verified_code").addEventListener("keyup", function () {
    if (verified_code.value.length === 6) {
        document.getElementById("btn_verify").style.backgroundColor = "#6d5dfc";
        document.getElementById("btn_verify").style.cursor = "pointer";
        document.getElementById("btn_verify").disabled = false;
    } else {
        document.getElementById("btn_verify").style.backgroundColor = "#D3D3D3";
        document.getElementById("btn_verify").disabled = true;
    }
});

document.getElementById('phone_number').addEventListener('input', function (e) {
    const phoneNumberInput = e.target;
    const cursorPosition = phoneNumberInput.selectionStart; // 현재 키보드 커서 위치를 저장

    let formattedPhoneNumber = formatPhoneNumber(phoneNumberInput.value);

    let newPosition = cursorPosition; // 입력 후 커서 위치 재조정

    // '-' 문자 추가로 인한 커서 위치 조정
    if(formattedPhoneNumber[cursorPosition-1] === '-') {
        newPosition += 1;
    }

    phoneNumberInput.value = formattedPhoneNumber;

    // 원래의 커서 위치로 복귀
    phoneNumberInput.setSelectionRange(newPosition, newPosition);
});

function formatPhoneNumber(phoneNumber) {
    // 숫자만 추출하여 연결
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    // 숫자를 세 부분으로 나눠서 배열로 저장
    const parts = [
        digitsOnly.slice(0, 3),
        digitsOnly.slice(3, 7),
        digitsOnly.slice(7)
    ];

    // 각 부분을 적절한 개수의 '_' 문자로 채우기
    for (let i = 0; i < parts.length; i++) {
        let expectedLength;

        switch(i) {
            case 0:
                expectedLength = 3;
                break;
            case 1:
                expectedLength = 4;
                break;
            default:
                expectedLength = 4;
                break;
        }

        while(parts[i].length < expectedLength) {
            parts[i] += '_';
        }
    }

    // '-' 문자와 함께 합치기
    return parts.join('-');
}


/**
 * @Explain : 인증번호 요청 클릭 이벤트 처리
 */
function requestVerificationCode() {
    let phoneNumber = document.getElementById("phone_number").value;
    let btnRequestCode = document.getElementById("btn_requestCode");

    if (validateInput('phone_number', phoneNumberRegex)) {
        fetch('/request/verificationCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"to": phoneNumber}),
        })
            .then(response => {
                if (!response.ok) { // HTTP status가 200~299가 아닌 경우
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }

                // 성공적으로 요청이 처리된 경우, 타이머 시작
                btnRequestCode.disabled = true; // 버튼 비활성화
                btnRequestCode.style.color = "";
                let countdown = 180; // 3분 = 180초

                const timerId = setInterval(() => {
                    countdown--;

                    if (countdown <= 0) { // 카운트다운 종료
                        clearInterval(timerId); // 타이머 중지
                        btnRequestCode.innerText = "인증번호 요청";
                        btnRequestCode.style.color = "#FFA500";
                        btnRequestCode.disabled = false; // 버튼 활성화
                    } else {
                        const minutes = Math.floor(countdown / 60);
                        const seconds = countdown % 60;
                        btnRequestCode.innerText =
                            `인증번호 재요청 (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
                    }

                }, 1000); // 초당 업데이트

                return response.text();
            })
            .then(text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return text;
                }
            })
            .then(data => alert("인증번호가 발송되었습니다."))
            .catch(error => {
                console.error('An error occurred:', error);
                alert(error.message);
            });
    } else {
        alert("올바른 핸드폰 번호를 입력해주세요.");
    }
}



/**
 * @Explain : 인증하기 버튼 클릭 이벤트처리
 */
function verifyCode() {

    const sent_code = document.getElementById("verified_code").value;
    const phoneNumber = document.getElementById("phone_number").value.replaceAll("-", "");

    if (sent_code.length === 6) {
        fetch('/request/verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "phone_number": phoneNumber,
                    "sent_code" : sent_code,
                }),
        })
            .then(response => response.json())
            .then(data => {console.log(data)
                if(data.verification_result === true){
                    alert("인증이 완료되었습니다.");
                    isPhoneNumberVerified = true;
                }else{
                    alert("인증에 실패하였습니다. 다시 시도해주세요.")
                    isPhoneNumberVerified = false;
                }}
            )
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert("올바른 인증번호를 입력해주세요.");
    }
}

function requestJoin() {
    // Form 데이터 가져오기
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('confirm_password').value;
    let birth_date = document.getElementById('birth_date').value;
    let phone_number = document.getElementById('phone_number').value.replaceAll("-", "");
    let verified_code = document.getElementById('verified_code').value;
    let email = document.getElementById('email').value;
    if (!validateInput('user_id', userIdRegex)) {
        alert("아이디가 유효하지 않습니다.");
        return;
    }
    if (!validateInput('password', passwordRegex)) {
        alert("비밀번호가 유효하지 않습니다.");
        return;
    }
    if (password !== confirm_password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
    if (!validateInput('birth_date', birthDateRegex)) {
        alert("생년월일이 유효하지 않습니다.");
        return;
    }
    if (!validateInput('phone_number', phoneNumberRegex)) {
        alert("핸드폰 번호가 유효하지 않습니다.");
        return;
    }

    if (email.length > 0 && !emailRegex.test(email)) {
        alert("이메일 주소가 유효하지 않습니다.");
        return;
    }

    if (isPhoneNumberVerified !== true) {
        alert("핸드폰 번호 인증을 완료해주세요.")
        return;
    }
    // 요청 생성
    fetch("/request/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "user_id": user_id,
            "password": password,
            "confirm_password": confirm_password,
            "birth_date": birth_date,
            "phone_number": phone_number,
            "verified_code": verified_code,
            "email": email
        })
    })
        .then(response => {
            if (!response.ok) { // HTTP status가 200~299가 아닌 경우
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                return text;
            }
        })
        .then(data => {
            alert(data);
            location.href = "/"
        })
        .catch(error => {
            // 예외 발생 시 사용자에게 오류 메시지를 표시
            console.error('An error occurred:', error);
            alert(error.message);
        });

}

function cancelRegistration() {
    location.href = "/";
}