 function connect () {
    let userName = document.getElementById("userNameInput").value;
     sessionStorage.setItem("currentUser", userName);
     window.location.href = 'chat';
};