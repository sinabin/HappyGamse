function handleLogin() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;

    let id_regex = /^[A-Za-z0-9]{6,25}$/;
    let password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if (!id_regex.test(user_id)) {
        alert("사용자 ID는 최소 6자리 이상, 최대 25자리 이하이며 소문자와 대문자 그리고 숫자들로만 구성될 수 있습니다.");
    }else if(!password_regex.test(password)){
        alert("패스워드는 10자리 이상이며 대문자와 소문자 그리고 특수문자를 포함해야만합니다.")
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

function moveFindingPage(){
    location.href = "/findAccountInfo"
}