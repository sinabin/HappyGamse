function handleLogin() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;

    let id_regex = /^[A-Za-z0-9]{6,25}$/;
    let password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

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

    const btn = document.getElementById("btn_find");
    const span = document.getElementById("btn_close");

    span.onclick = function() {
        modal.style.display = "none";
        resetModalContent();
    }

    window.onclick = function (event) {
        if (event.target == modal) {
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
            <input type='text' id='phone_number' placeholder="핸드폰번호를 입력해주세요." style="border: 1px solid gray; width: 60%;">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <input type='text' id='verification_code' placeholder="인증번호를 입력해주세요." style="border: 1px solid gray; width: 50%; padding-left :5px;">
            <button onclick='requestVerificationCode()' style="margin-left: 5px; margin-bottom: 14px; width: 39%">인증번호 요청</button><br/>
       </div>
       <button onclick='findPW()' style="">찾기</button>`;
}



function closeModal(){
    const modal = document.getElementById('findModal');
    modal.style.display = "none";
    resetModalContent();
}

function findID(){
    /* 아이디를 핸드폰 번호로 검색하는 코드 */
}

function findPW(){
    /* 비밀번호를 핸드폰 번호로 검색하는 코드 */
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