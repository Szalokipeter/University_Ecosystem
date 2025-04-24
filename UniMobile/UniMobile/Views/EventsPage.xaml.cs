using UniMobile.Models;
using UniMobile.Services;

namespace UniMobile.Views;

public partial class EventsPage : ContentPage
{
    private readonly EventService _eventService;

    public EventsPage()
    {
        InitializeComponent();
        _eventService = new EventService();
        LoadEvents();
    }

    private async void LoadEvents()
    {
        try
        {
            var events = await _eventService.GetEventsAsync();
            EventCollectionView.ItemsSource = events;
        }
        catch (Exception ex)
        {
            await DisplayAlert("Error", $"Failed to load events: {ex.Message}", "OK");
        }
    }

    private async void OnChangeStatusClicked(object sender, EventArgs e)
    {
        if (sender is Button button && button.BindingContext is Event selectedEvent)
        {
            try
            {
                string success = await _eventService.UpdateEventAsync(selectedEvent.id);
                if (!success.Contains("Unsubscribed"))
                {
                    await DisplayAlert("Success", "You have successfully subscribed to the event.", "OK");
                    selectedEvent.subscribed = true;
                    //EventCollectionView.ItemsSource = await _eventService.GetEventsAsync();
                }
                else
                {
                    await DisplayAlert("Success", "You have successfully unsubscribed from the event.", "OK");
                    selectedEvent.subscribed = false;
                    //EventCollectionView.ItemsSource = await _eventService.GetEventsAsync();
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error", $"An error occurred: {ex.Message}", "OK");
            }
        }
    }
}
