package com.example.happyusf.Utils;

public enum Const {
    인증번호자리수(1000000), // 상수를 정의함과 동시 생성자를 호출함.
    테스트자리(20000);

    private int Myconst;
    Const(int getConst) {
        this.Myconst = getConst;
    }

    public int getConst(){
        return this.Myconst;
    }

}
