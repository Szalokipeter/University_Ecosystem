using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.Runtime;
using UniversityApp.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace UniversityApp.Services
{
    public class Dataservice
    {
        // https://bgs.jedlik.eu/book100api/api/PersonalEvents
       
        static string url = "https://bgs.jedlik.eu";
        public static async Task<IEnumerable<PersonalEventsModel>> getAllPersonalEvents()
        {
            using (var client = new HttpClient()) {
                client.BaseAddress = new Uri(url);
                var uri = "/book100api/api/books";
                var result = await client.GetStringAsync(uri);
                return JsonConvert.DeserializeObject<ObservableCollection<PersonalEventsModel>>(result);
            }

        }

        public static async Task<LoginModel> login(LoginModel user)
        {
            LoginModel errorLogin = new LoginModel();

            string jsonData = JsonConvert.SerializeObject(user);
            StringContent content = new StringContent(jsonData,Encoding.UTF8,"application/json");

            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.PostAsync(url+ "/book100api/api/register", content);

            Debug.WriteLine(response.StatusCode);
            Debug.WriteLine((int)response.StatusCode);
            Debug.WriteLine(response.Content);

            string result = await response.Content.ReadAsStringAsync();

            if ((int)response.StatusCode == 400)
            {
                // hiba
                JObject errorObj = JsonConvert.DeserializeObject<JObject>(result);

                //if (errorObj.TryGetValue("name", out var nameToken))
                //{
                //    errorLogin.name = (string)nameToken[0];
                //}
                if (errorObj.TryGetValue("email", out var emailToken))
                {
                    errorLogin.email = (string)emailToken[0];
                }
                if (errorObj.TryGetValue("password", out var passwordToken))
                {
                    errorLogin.password = (string)passwordToken[0];
                }
                //if (errorObj.TryGetValue("confirm_password", out var confirmPasswordToken))
                //{
                //    errorLogin.confirm_password = (string)confirmPasswordToken[0];
                //}
            }
            return errorLogin;
        }
    }
}
