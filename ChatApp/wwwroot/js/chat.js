// Kreiranje konekcije sa SignalR hub-om
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat-hub")
    .build();

// Pokretanje konekcije
connection.start().then(function () {
    console.log("Povezan na SignalR hub na drugoj strani");
}).catch(function (err) {
    console.error(err.toString());
});

// Funkcija za ažuriranje liste aktivnih korisnika
function updateActiveUsers(userList) {
    const userListElement = document.getElementById("list-users");
    userList.forEach(function (user) {
        const li = `<li class="list-group-item" data-bs-toggle="tooltip" data-bs-placement="right"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="Chat with ${user}">${user}<br /> <span class="active-user">• ACTIVE</span></li>`;
        userListElement.innerHTML += li;
    });
}

// Rukovanje događajem kada se korisnik poveže
connection.on("UserConnected", function (userName, userList) {
    updateActiveUsers(userList);
    console.log(userList)
});

// Rukovanje događajem kada se korisnik odvoji
connection.on("UserDisconnected", function (userName, userList) {
    updateActiveUsers(userList);
});