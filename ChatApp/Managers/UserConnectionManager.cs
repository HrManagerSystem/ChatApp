using System.Collections.Concurrent;

namespace ChatApp.Managers
{
    public class UserConnectionManager
    {
        private static readonly ConcurrentDictionary<string, string> _activeUsers = new ConcurrentDictionary<string, string>();

        public bool AddUser(string connectionId, string userName)
        {
            return _activeUsers.TryAdd(connectionId, userName);
        }

        public bool RemoveUser(string connectionId)
        {
            return _activeUsers.TryRemove(connectionId, out _);
        }

        public List<string> GetAllUsers()
        {
            return _activeUsers.Values.ToList();
        }

        public string GetByUserName(string username)
        {
            return _activeUsers.Where(x => x.Value == username).FirstOrDefault().Value;
        }
    }
}
