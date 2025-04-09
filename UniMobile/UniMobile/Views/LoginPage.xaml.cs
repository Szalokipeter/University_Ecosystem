using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;
using Microsoft.Maui.Controls;
using UniMobile.Services;
using System.Threading.Tasks;
using Plugin.Fingerprint;
using Plugin.Fingerprint.Abstractions;
using Microsoft.Maui.Storage;
using UniMobile.Models;


namespace UniMobile.Views;

public partial class LoginPage : ContentPage
{
    private readonly HttpClient _httpClient = new HttpClient();

    public LoginPage()
    {
        InitializeComponent();
        Task.Run(async () =>
        {
            var storedEmail = await SecureStorage.GetAsync("user_email");
            var storedPwd = await SecureStorage.GetAsync("user_pwd");
            if (string.IsNullOrEmpty(storedEmail) || string.IsNullOrEmpty(storedPwd))
            {
                btnBiometric.IsEnabled = false;
            }
            else
            {
                btnBiometric.IsEnabled = true;
            }
        });
    }

    private async void OnLoginClicked(object sender, EventArgs e)
    {
        Application.Current.MainPage = new AppShell();

        var email = EmailEntry.Text;
        var password = PasswordEntry.Text;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            await DisplayAlert("Error", "Please enter email and password", "OK");
            return;
        }

        var loginUrl = "http://3.127.249.5:8000/api/login";
        var loginData = new { email = email, password = password };
        var content = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");

        //try
        //{
        //    var response = await _httpClient.PostAsync(loginUrl, content);
        //    if (response.IsSuccessStatusCode)
        //    {
        //        var responseString = await response.Content.ReadAsStringAsync();
        //        var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(responseString);
        //        var username = loginResponse!.User.Username;
        //        var token = loginResponse.Token;

        //        await StorageService.StoreCredentials(email, password, username, token);

        //        Application.Current.MainPage = new AppShell();
        //    }
        //    else
        //    {
        //        await DisplayAlert("Login Failed", "Invalid credentials", "OK");
        //    }
        //}
        //catch (HttpRequestException httpEx)
        //{
        //    var statusCode = httpEx.StatusCode.HasValue ? httpEx.StatusCode.ToString() : "N/A";
        //    await DisplayAlert("Connection Error", $"Request error: {httpEx.Message}\nStatus Code: {statusCode}", "OK");
        //}
        //catch (Exception ex)
        //{
        //    await DisplayAlert("Error", $"An unexpected error occurred: {ex.Message}", "OK");
        //}
    }

    private async void OnBiometricLoginClicked(object sender, EventArgs e)
    {
        var storedEmail = await SecureStorage.GetAsync("user_email");
        var storedPwd = await SecureStorage.GetAsync("user_pwd");
        if (string.IsNullOrEmpty(storedEmail) || string.IsNullOrEmpty(storedPwd))
        {
            await DisplayAlert("Error", "No stored credentials found. Please login normally first.", "OK");
            return;
        }
        var isBiometricAvailable = await CrossFingerprint.Current.IsAvailableAsync();
        if (!isBiometricAvailable)
        {
            await DisplayAlert("Error", "Biometric authentication is not available.", "OK");
            return;
        }

        var authResult = await CrossFingerprint.Current.AuthenticateAsync(new AuthenticationRequestConfiguration("Authentication", "Scan your fingerprint"));
        if (authResult.Authenticated)
        {
            var loginUrl = "http://3.127.249.5:8000/api/login";
            var loginData = new { email = storedEmail, password = storedPwd };
            var content = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(loginUrl, content);
                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(responseString);
                    var username = loginResponse!.User.Username;
                    var token = loginResponse.Token;
                    await StorageService.StoreCredentials(storedEmail, storedPwd, username, token);
                    Application.Current.MainPage = new AppShell();
                }
                else
                {
                    await DisplayAlert("Login Failed", "Biometric authentication failed.", "OK");
                }
            }
            catch (HttpRequestException httpEx)
            {
                var statusCode = httpEx.StatusCode.HasValue ? httpEx.StatusCode.ToString() : "N/A";
                await DisplayAlert("Connection Error", $"Request error: {httpEx.Message}\nStatus Code: {statusCode}", "OK");
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error", $"An unexpected error occurred: {ex.Message}", "OK");
            }
        }
        else
        {
            await DisplayAlert("Authentication Failed", "Fingerprint not recognized.", "OK");
        }
    }
}
