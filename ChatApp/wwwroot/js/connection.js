let userName;

let connection 

document.getElementById("connectButton").addEventListener("click", function () {
    userName = document.getElementById("userNameInput").value;
    if (userName) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("/chat-hub?userName=" + encodeURIComponent(userName))
            .build();
        connection.start().then(function () {
            connection.invoke("ConnectUser", userName).then(function () {
                console.log("Connected as " + userName);
            });
        }).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        alert("Please enter a name.");
    }

    window.location.href = 'chat';
});

connection.on("UserConnected", function (userName, userList) {
    updateActiveUsers(userList);
});

connection.on("UserDisconnected", function (userName, userList) {
    updateActiveUsers(userList);
});

function updateActiveUsers(userList) {
    //const userListElement = document.getElementById("userList");
    //userListElement.innerHTML = "";

    //userList.forEach(function (user) {
    //    const li = document.createElement("li");
    //    li.textContent = user;
    //    userListElement.appendChild(li);
    //});
    console.log(userList);
}