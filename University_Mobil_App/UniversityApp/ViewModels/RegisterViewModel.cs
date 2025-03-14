using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using UniversityApp.Models;
using UniversityApp.Services;

namespace UniversityApp.ViewModels
{
    public class LoginViewModel : BindableObject
    {
        private LoginModel _loginError = new LoginModel();

        public LoginModel loginData { get; set; } = new LoginModel();

        public LoginModel loginError { get => _loginError; set { _loginError = value; OnPropertyChanged(); } }

        public ICommand loginCommand { get; set; }

        public LoginViewModel()
        {
            loginCommand = new Command( async () => {
                //Debug.WriteLine(loginData.name);
                loginError =  await Dataservice.login(loginData);
                if (
                    //string.IsNullOrEmpty(loginError.name) &&
                    string.IsNullOrEmpty(loginError.email) &&
                    string.IsNullOrEmpty(loginError.password)
                    //string.IsNullOrEmpty(loginError.confirm_password) 
                )
                {
                    await App.Current.MainPage.DisplayAlert("","Logged in successfuly!","OK");
                    await Shell.Current.GoToAsync("//PersonalEvents");
                }

            });
        }
    }
}
