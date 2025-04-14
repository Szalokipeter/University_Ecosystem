using UniMobile.Views;
using Microsoft.Maui.Controls;
using UniMobile.Services;

namespace UniMobile
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
            //MainPage = new NavigationPage(new LoginPage());

            Task.Run(async () =>
            {
                await StorageService.ClearAuthToken();
                MainPage = new NavigationPage(new LoginPage());
                
            }).Wait();
        }

        // Remove the CreateWindow override
        // protected override Window CreateWindow(IActivationState? activationState)
        // {
        //     return new Window(new AppShell());
        // }
    }
}