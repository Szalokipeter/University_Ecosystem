using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using UniMobile.Models;

namespace UniMobile.Services
{
    public class EventService
    {
        private readonly HttpClient _httpClient = new HttpClient();

        private async Task SetBearerTokenAsync()
        {
            var token = await StorageService.GetAuthToken();
            if (!string.IsNullOrEmpty(token))
            {
                if (_httpClient.DefaultRequestHeaders.Contains("Authorization"))
                {
                    _httpClient.DefaultRequestHeaders.Remove("Authorization");
                }
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
        }
        public async Task<List<Event>> GetEventsAsync()
        {
            await SetBearerTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Get, "http://52.28.154.228:8000/api/uniCalendar/withSubs");
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<List<Event>>(responseContent);
            }
            return new List<Event>();
        }
        public async Task<string> UpdateEventAsync(int id)
        {
            await SetBearerTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Post, $"http://52.28.154.228:8000/api/uniCalendar/{id}/signup");
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }

    }
}
