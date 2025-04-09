using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using UniMobile.Models;
using Microsoft.Maui.Storage;

namespace UniMobile.Services
{
    public class TodoService
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

        public async Task<List<Todo>> GetTodosAsync()
        {
            await SetBearerTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Get, "http://3.127.249.5:8000/api/personalTodos");
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<List<Todo>>(responseContent);
            }
            return new List<Todo>();
        }

        public async Task<bool> CreateTodoAsync(Todo newTodo)
        {
            await SetBearerTokenAsync();
            var requestBody = new
            {
                title = newTodo.Title,
                body = newTodo.Body
            };
            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, "http://3.127.249.5:8000/api/personalTodos")
            {
                Content = content
            };
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateTodoAsync(int id, Todo updatedTodo)
        {
            await SetBearerTokenAsync();
            var requestBody = new
            {
                title = updatedTodo.Title,
                body = updatedTodo.Body,
                status = updatedTodo.Status
            };
            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Put, $"http://3.127.249.5:8000/api/personalTodos/{id}")
            {
                Content = content
            };
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteTodoAsync(int id)
        {
            await SetBearerTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Delete, $"http://3.127.249.5:8000/api/personalTodos/{id}");
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            return response.IsSuccessStatusCode;
        }
    }
}
