$(document).ready(function() {

    
});

function signInBtnClick() {

    window.location.href = "http://localhost:3200/signin?redirect=http://localhost:3200/verify/";
}

function signUpBtnClick() {

    window.location.href = "http://localhost:3200/signin?redirect=http://localhost:3200/verify/&action=register";
}

function useCXBtnClick() {

    window.location.href = "http://localhost:3200/integrate";
}
