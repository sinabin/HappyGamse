const userIdRegex = /^[A-Za-z0-9]{6,25}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/; // XXX-XXXX-XXXX format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateInput(inputId, regex) {
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

document.getElementById('birth_date').addEventListener('keyup', function () {
    if (!validateInput("birth_date", birthDateRegex)) {
        updateErrorMessage("birth_date", "생년월일은 YYYY-MM-DD 형태여야 합니다.");
    } else {
        updateErrorMessage("birth_date", "");
    }
});

document.getElementById("phone_number").addEventListener("keyup", function () {
    if (!validateInput("phone_number", phoneNumberRegex)) {
        updateErrorMessage(
            "phone_number",
            "핸드폰 번호는 XXX-XXXX-XXXX 형태여야 합니다."
        );
    } else {
        updateErrorMessage("phone_number", "");
    }
});


function requestVerificationCode() {
    if (validateInput('phone_number', phoneNumberRegex)) {
        document.querySelector("button[onclick='requestVerificationCode()']").disabled = false;
    } else {
        alert("올바른 핸드폰 번호를 입력해주세요.");
    }
}

function verifyCode() {
    if (document.querySelector("input[placeholder='인증번호 입력']").value.length === 6) {
        document.querySelector("button[onclick='verifyCode()']").disabled = false;
    } else {
        alert("올바른 인증번호를 입력해주세요.");
    }
}

document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateInput('user_id', userIdRegex)) {
        alert("아이디가 유효하지 않습니다.");
        return;
    }
    if (!validateInput('password', passwordRegex)) {
        alert("비밀번호가 유효하지 않습니다.");
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

    let emailValue = document.getElementById('email').value;
    if (emailValue && !emailRegex.test(emailValue)) {
        alert("이메일 주소가 유효하지 않습니다.");
        return;
    }
    this.submit();
});

function cancelRegistration() {
    location.href = "/";
}