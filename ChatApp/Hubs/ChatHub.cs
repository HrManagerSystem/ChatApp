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

        public async Task ConnectUser(string userName)
        {
            string userId = Context.ConnectionId;

            if (_userConnectionManager.AddUser(userId, userName))
            {
                var allUsers = _userConnectionManager.GetAllUsers();
                await Clients.All.SendAsync("UserConnected", userName, allUsers);
            }
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
