package com.example.happyusf.Utils;

public enum Const {
    최고관리자("A0"),
    일반관리자("AN"),
    일반회원("N0"),
    레벨1회원("N1"),
    레벨2회원("N2"),
    레벨3회원("N3");

    private String code;

    Const(String Code) {
        this.code = code;
    }

    public String getConst(){
        return this.code;
    }

}
