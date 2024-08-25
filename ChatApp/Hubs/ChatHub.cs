using ChatApp.Managers;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly UserConnectionManager _userConnectionManager;

        public ChatHub(UserConnectionManager userConnectionManager)
        {
            _userConnectionManager = userConnectionManager;
        }

        public override async Task OnConnectedAsync()
        {
            string userName = Context.GetHttpContext().Request.Query["userName"];
            string userId = Context.ConnectionId;

            Console.WriteLine($"Povezan korisnik: {userName}, ConnectionId: {userId}");

            if (!string.IsNullOrEmpty(userName))
            {
                _userConnectionManager.AddUser(userId, userName);

                // Pošaljite novu listu svih aktivnih korisnika svakom klijentu
                var allUsers = _userConnectionManager.GetAllUsers();
                Console.WriteLine("Slanje korisnika klijentima: " + string.Join(", ", allUsers));
                await Clients.All.SendAsync("UserListUpdated", allUsers);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string userId = Context.ConnectionId;

            if (_userConnectionManager.RemoveUser(userId))
            {
                // Ažurirana lista korisnika se šalje svim klijentima
                await Clients.All.SendAsync("UserDisconnected", userId, _userConnectionManager.GetAllUsers());
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
