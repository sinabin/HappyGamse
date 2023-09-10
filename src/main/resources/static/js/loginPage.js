let isPhoneNumberVerified = false;
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()\-=+])[A-Za-z\d@$!%*?&#()\-=+]{10,}$/;
const phone_number_regex = /^[0-9]{10,11}$/;

function handleLogin() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;

    let id_regex = /^[A-Za-z0-9]{6,25}$/;

    if (!id_regex.test(user_id)) {
        alert("사용자 ID는 최소 6자리 이상, 최대 25자리 이하이며 소문자와 대문자 그리고 숫자들로만 구성될 수 있습니다.");
        return;
    }else if(!password_regex.test(password)){
        alert("패스워드는 10자리 이상이며 대문자와 소문자 그리고 특수문자를 포함해야만합니다.")
        return;
    }

    if(user_id.length < 1){
        alert("아이디를 입력해주세요.");
        return;
    }else if(password.length < 1){
        alert("패스워드를 입력해주세요.");
        return;
    }

    // Convert FormData to x-www-form-urlencoded
    let formData = new URLSearchParams();
    formData.append("user_id", user_id);
    formData.append("password", password);

    fetch('/loginAction', {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    })
        .then(response => {
            if (response.ok) { // HTTP 상태 코드가 200-299인 경우 response.ok는 true입니다.
                alert('로그인에 성공하였습니다!');
                location.href = "/";
            } else {
                return response.text(); // 에러 메시지를 받아옵니다.
            }
        })
        .then(message => { // 로그인 실패 시 에러 메시지를 출력합니다.
            if (message) {
                alert('로그인 실패 : ' + message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function moveRegister() {
    location.href = "/register/agreement"
}

function showFindModal(){
    // Get the modal
    const modal = document.getElementById('findModal');
    modal.style.display = "flex";

    const span = document.getElementById("btn_close");

    span.onclick = function() {
        modal.style.display = "none";
        resetModalContent();
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            resetModalContent();
        }
    }
}

function renderFindID() {
    let contentDiv = document.getElementById('modal-content');
    contentDiv.innerHTML =
        `<span id="btn_close" onclick="closeModal()">&times;</span>
        <h2>아이디 찾기</h2>
        <span>회원가입시 등록했던 핸드폰 번호로 아이디를 발송합니다. (-)하이폰 없이 입력해주세요.</span><br><br>
       <input type='text' id='phone_number' placeholder="핸드폰 번호를 입력해주세요." style="border: 1px solid gray; width: 60%"><br>
       <button onclick='findID()'>찾기</button>`;
}

function renderFindPW() {
    let contentDiv = document.getElementById('modal-content');
    contentDiv.innerHTML =
        `<span id="btn_close" onclick="closeModal()">&times;</span>
        <h2>비밀번호 재설정</h2>
        <span>회원가입시 등록했던 핸드폰 번호로 인증코드가 발송됩니다. (-)하이폰 없이 입력해주세요.</span><br><br>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type='text' id='phone_number' placeholder="핸드폰번호를 입력해주세요." style="border: 1px solid gray; width: 50%;">
            <button id="btn_requestCode" onclick='requestVerificationCodeForPW()' style="margin-left: 5px; margin-bottom: 14px; width: 39%">인증번호 요청</button><br/>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <input type='text' maxlength="6" id='verification_code' placeholder="인증번호를 입력해주세요." style="border: 1px solid gray; width: 50%;">
            <button id="btn_requestVerification" onclick='VerifyCodeForPW()' style="margin-left: 5px; margin-bottom: 14px; width: 39%">인증하기</button><br/>
       </div>
       <!-- Password input fields -->
       <div id='password-fields' style='display:none'>
           <input type='password' id ='new_password' placeholder= '새로운 비밀번호'><br/>
           <input type='password' id ='confirm_new_password' placeholder= '비밀번호 재입력'><br/>
       </div>
       <!-- Reset password button -->
       <button onclick='resetPW()' >재설정</button>`;
}

function requestVerificationCodeForPW() {
    let phoneNumber = document.getElementById("phone_number").value;
    let btnRequestCode = document.getElementById("btn_requestCode");

    fetch('/request/account/verificationCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"to": phoneNumber}),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }

            // 성공적으로 요청이 처리된 경우, 타이머 시작
            btnRequestCode.disabled = true; // 버튼 비활성화
            btnRequestCode.style.color = "#FFA500";
            let countdown = 180; // 3분 = 180초

            const timerId = setInterval(() => {
                countdown--;

                if (countdown <= 0) { // 카운트다운 종료
                    clearInterval(timerId); // 타이머 중지
                    btnRequestCode.innerText = "인증번호 재요청";
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
        .then(data => alert(data))
        .catch(error => {
            console.error('An error occurred:', error);
            alert(error.message);
        });
}


/**
 * @Explain : 인증하기 버튼 클릭 이벤트처리
 */
function VerifyCodeForPW() {

    const sent_code = document.getElementById("verification_code").value;
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
                    document.getElementById('password-fields').style.display = 'block';
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


function closeModal(){
    const modal = document.getElementById('findModal');
    modal.style.display = "none";
    resetModalContent();
}

function findID(){

    const phoneNumber = document.getElementById("phone_number").value;

    if(!phone_number_regex.test(phoneNumber)){
        alert("유효한 핸드폰 번호를 입력해주세요.");
        return;
    }

    fetch('/request/findIdByMobile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "to": phoneNumber,
            }),
    })
        .then(response => {
            if (!response.ok) { // HTTP status가 200~299가 아닌 경우
                return response.text().then(text => {
                    throw new Error(text);
                });
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
        })
        .catch(error => {
            console.error('An error occurred:', error);
            alert(error.message);
        });

}

function resetPW(){

    if(!isPhoneNumberVerified){
        alert("핸드폰 인증을 완료해주세요.");
        return;
    }


    const phone_number = document.getElementById("phone_number").value;
    const new_password = document.getElementById("new_password").value;
    const confirm_new_password = document.getElementById("confirm_new_password").value
    if(!password_regex.test(new_password)){
        alert("비밀번호는 최소 하나의 대문자, 소문자, 숫자와 특수 문자(@$!%*?&)을 포함한 10글자 이상이어야 합니다.");
        return;
    }else if(new_password !== confirm_new_password){
        alert("비밀번호입력이 일치하지않습니다. 다시 입력해주세요.");
        return;
    }

    if(!phone_number_regex.test(phone_number)){
        alert("유효한 핸드폰 번호를 입력해주세요.");
        return;
    }

    fetch('/request/resetPasswordByMobile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "password" : new_password,
                "phone_number": phone_number,
            }),
    })
        .then(response => {
            if (!response.ok) { // HTTP status가 200~299가 아닌 경우
                return response.text().then(text => {
                    throw new Error(text);
                });
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
            closeModal();
        })
        .catch(error => {
            console.error('An error occurred:', error);
            alert(error.message);
        });
}

// 모달 컨텐츠 초기화
function resetModalContent() {
    let contentDiv = document.getElementById('modal-content');
    contentDiv.innerHTML =
        `<span id="btn_close">&times;</span>
      <p>로그인하는데 문제가 있으신가요?</p>
      <button onclick="renderFindID()">아이디 찾기</button><br/>
      <button onclick="renderFindPW()">비밀번호 재설정</button><br/>`;
}

document.getElementById("btn_close").addEventListener("click", resetModalContent);