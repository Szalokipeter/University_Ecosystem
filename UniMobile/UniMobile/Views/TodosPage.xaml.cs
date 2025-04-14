using UniMobile.Models;
using UniMobile.Services;
namespace UniMobile.Views;

public partial class TodosPage : ContentPage
{
    private readonly TodoService _todoService;
    private bool _todosChanged;

    public TodosPage()
    {
        InitializeComponent();
        _todoService = new TodoService();
        _todosChanged = true;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (_todosChanged)
        {
            LoadTodos();
            _todosChanged = false;
        }
    }

    private async void LoadTodos()
    {
        try
        {
            var todos = await _todoService.GetTodosAsync();
            TodosCollectionView.ItemsSource = todos;
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", $"Failed to load todos: {ex.Message}", "OK");
        }
    }

    private async void OnAddTodoClicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new TodoDetailsPage(_todoService));
        _todosChanged = true;
    }

    private async void OnSelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (e.CurrentSelection.FirstOrDefault() is not Todo selectedTodo)
            return;

        await Navigation.PushAsync(new TodoDetailsPage(_todoService, selectedTodo));
        _todosChanged = true;
        TodosCollectionView.SelectedItem = null;
    }

    private async void OnDeleteSwipeItemInvoked(object sender, EventArgs e)
    {
        if (sender is SwipeItem swipeItem && swipeItem.CommandParameter is Todo todoToDelete)
        {
            bool confirm = await DisplayAlert("Delete", $"Are you sure you want to delete '{todoToDelete.Title}'?", "Yes", "No");
            if (!confirm)
                return;

            bool success = await _todoService.DeleteTodoAsync(todoToDelete.Id);
            if (success)
            {
                await DisplayAlert("Deleted", "Todo deleted.", "OK");
                LoadTodos();
            }
            else
            {
                await DisplayAlert("Error", "Failed to delete todo.", "OK");
            }
        }
    }
}
