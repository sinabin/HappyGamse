function handleLogin() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;

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
                console.log(message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
