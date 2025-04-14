using UniMobile.Services;

namespace UniMobile.Views;

public partial class ProfilePage : ContentPage
{
    public ProfilePage()
    {
        InitializeComponent();
        LoadUserData();
    }
    private async void LoadUserData()
    {
        var email = await SecureStorage.GetAsync("user_email");
        var username = await SecureStorage.GetAsync("username");

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(username))
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                Application.Current.MainPage = new NavigationPage(new LoginPage());
            });
        }
        else
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                lblEmail.Text = email;
                lblUsername.Text = username;
            });
        }
    }
    private async void OnSignOutClicked(object sender, EventArgs e)
    {
        await StorageService.ClearAuthToken();

        await DisplayAlert("Signed Out", "You have been signed out.", "OK");

        Application.Current.MainPage = new NavigationPage(new LoginPage());
    }
}