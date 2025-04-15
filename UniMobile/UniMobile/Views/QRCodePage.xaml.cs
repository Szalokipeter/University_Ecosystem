using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using ZXing.Net.Maui;
using ZXing.Net.Maui.Controls;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Maui.Controls;
using UniMobile.Services;
using UniMobile.Models;

namespace UniMobile.Views;

public partial class QRCodePage : ContentPage
{
    private readonly HttpClient _httpClient = new HttpClient();
    public QRCodePage()
    {
        InitializeComponent();
        cameraBarcodeReaderView.Options = new BarcodeReaderOptions
        {
            Formats = BarcodeFormats.TwoDimensional,
            AutoRotate = true,
            Multiple = false
        };
    }
    private async void CameraBarcodeReaderView_BarcodesDetected(object sender, BarcodeDetectionEventArgs e)
    {
        var scannedToken = e.Results.FirstOrDefault()?.Value;

        if (string.IsNullOrWhiteSpace(scannedToken))
            return;

        cameraBarcodeReaderView.IsDetecting = false;

        await Dispatcher.DispatchAsync(async () =>
        {
            ResultLabel.Text = "Processing QR code...";

            var authToken = await StorageService.GetAuthToken();
            var email = await SecureStorage.GetAsync("user_email");
            var password = await SecureStorage.GetAsync("user_pwd");

            if (string.IsNullOrWhiteSpace(authToken) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                await DisplayAlert("Error", "Missing credentials. Please login first.", "OK");
                cameraBarcodeReaderView.IsDetecting = true;
                return;
            }

            var requestData = new
            {
                email,
                password,
                token = scannedToken
            };

            var json = JsonConvert.SerializeObject(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, "http://52.28.154.228:8000/api/qrcode/login")
                {
                    Content = content
                };
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    ResultLabel.Text = "Successfully signed in via QR!";
                    await DisplayAlert("Success", "QR code login successful!", "OK");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    ResultLabel.Text = "Login failed.";
                    await DisplayAlert("Failed", $"QR code login failed.\nResponse: {JsonConvert.DeserializeObject<QRLoginResponse>(errorContent)!.Status}", "OK");
                }
            }
            catch (Exception ex)
            {
                ResultLabel.Text = "Error occurred.";
                await DisplayAlert("Error", ex.Message, "OK");
            }
            finally
            {
                await Task.Delay(3000);
                cameraBarcodeReaderView.IsDetecting = true;
            }
        });
    }
}