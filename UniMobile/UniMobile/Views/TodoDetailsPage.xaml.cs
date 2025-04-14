using UniMobile.Models;
using UniMobile.Services;

namespace UniMobile.Views;

public partial class TodoDetailsPage : ContentPage
{
    private readonly TodoService _todoService;
    private readonly Todo _todo;

    public TodoDetailsPage(TodoService todoService, Todo todo = null)
    {
        InitializeComponent();
        _todoService = todoService;
        _todo = todo;

        if (_todo != null)
        {
            TitleEntry.Text = _todo.Title;
            BodyEditor.Text = _todo.Body;
            StatusPicker.SelectedItem = _todo.Status;
        }
        else
        {
            TitleEntry.Text = string.Empty;
            BodyEditor.Text = string.Empty;
            lblStatus.IsVisible = false;
            StatusPicker.IsVisible = false;
            StatusPicker.IsEnabled = false;
        }

        BindingContext = new { IsDeleteVisible = _todo != null };
    }

    private async void OnSaveClicked(object sender, EventArgs e)
    {
        var title = TitleEntry.Text;
        var body = BodyEditor.Text;
        var status = StatusPicker.SelectedItem?.ToString();

        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(body))
        {
            await DisplayAlert("Error", "Title and Body are required.", "OK");
            return;
        }

        if (_todo == null)
        {
            var newTodo = new Todo { Title = title, Body = body, Status = status };
            var success = await _todoService.CreateTodoAsync(newTodo);
            if (success)
            {
                await DisplayAlert("Success", "Todo created.", "OK");
            }
            else
            {
                await DisplayAlert("Error", "Failed to create todo.", "OK");
            }
        }
        else
        {
            _todo.Title = title;
            _todo.Body = body;
            _todo.Status = status;

            var success = await _todoService.UpdateTodoAsync(_todo.Id, _todo);
            if (success)
            {
                await DisplayAlert("Success", "Todo updated.", "OK");
            }
            else
            {
                await DisplayAlert("Error", "Failed to update todo.", "OK");
            }
        }

        await Navigation.PopAsync();
    }

    private async void OnDeleteClicked(object sender, EventArgs e)
    {
        if (_todo == null) 
        {
            await Navigation.PopAsync(); 
            return; 
        }

        bool confirm = await DisplayAlert("Delete", $"Delete '{_todo.Title}'?", "Yes", "No");
        if (!confirm) return;

        var success = await _todoService.DeleteTodoAsync(_todo.Id);
        if (success)
        {
            await DisplayAlert("Deleted", "Todo deleted.", "OK");
            await Navigation.PopAsync();
        }
        else
        {
            await DisplayAlert("Error", "Failed to delete todo.", "OK");
        }
    }
}
