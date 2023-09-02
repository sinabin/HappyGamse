const btn_next = document.getElementById("btn_next")
const agreement1 = document.getElementById("agree1");
const agreement2 = document.getElementById("agree2");

agreement1.addEventListener("change", checkBoth);
agreement2.addEventListener("change", checkBoth);

function checkBoth() {
    if(agreement1.checked && agreement2.checked) {
        btn_next.disabled = false;
        btn_next.style.backgroundColor = '#6d5dfc';
    } else {
        btn_next.disabled = true;
        btn_next.style.backgroundColor = '#D3D3D3';
    }
}

function moveSingUpPage(){
    location.href = "/register/agreement/signup";
}