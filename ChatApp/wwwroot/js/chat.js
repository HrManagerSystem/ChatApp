let connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat-hub")
    .build();

connect();

function connect() {
    let userName = sessionStorage.getItem('currentUser');
    if (userName) {
        connection.start().then(function () {
            connection.invoke("ConnectUser", userName).then(function () {
                console.log("Connected as " + userName);
                const heading = document.getElementById("heading");
                heading.innerHTML = userName + ", welcome to the chat!"
            });
        }).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        alert("Please enter a name.");
    }
};

connection.on("UserConnected", function (userName, userList) {
    updateActiveUsers(userList, userName);
    console.log(userList);
});

connection.on("MessageReceive", function (userName, message) {
    console.log(`${userName} said ${message}`);
});

connection.on("UserDisconnected", function (userName, userList) {
    updateActiveUsers(userList, userName);
});

function sendMessage() {
    let userMessage = document.getElementById("txtMessage").value;
    let currentUser = sessionStorage.getItem("currentUser");
}

function updateActiveUsers(userList, userName) {
    sessionStorage.setItem("users", JSON.stringify(userList));
    sessionStorage.setItem("currentUser", userName);
    console.log(userList)

    const userListElement = document.getElementById("list-users");
    userListElement.innerHTML = '';

    if (userListElement) {
        userList.forEach(function (user) {
            const li = `<li class="list-group-item" data-bs-toggle="tooltip" data-bs-placement="right"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="Chat with ${user}">${user}<br /> <span class="active-user">• ACTIVE</span></li>`;
            userListElement.innerHTML += li;
        });
    }
}