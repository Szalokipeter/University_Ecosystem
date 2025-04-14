using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Storage;

namespace UniMobile.Services
{
    public static class StorageService
    {
        public static async Task StoreCredentials(string email, string password, string username, string token)
        {
            await SecureStorage.SetAsync("auth_token", token);
            await SecureStorage.SetAsync("user_email", email);
            await SecureStorage.SetAsync("user_pwd", password);
            await SecureStorage.SetAsync("username", username);
        }

        public static async Task<string> GetAuthToken()
            => await SecureStorage.GetAsync("auth_token");

        public static async Task ClearCredentials()
        {
            SecureStorage.Remove("auth_token");
            SecureStorage.Remove("user_email");
            SecureStorage.Remove("user_pwd");
            SecureStorage.Remove("username");
        }
        public static async Task ClearAuthToken()
        {
            SecureStorage.Remove("auth_token");
        }
    }
}
