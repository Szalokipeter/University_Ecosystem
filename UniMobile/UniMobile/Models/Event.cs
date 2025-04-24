using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UniMobile.Models
{
    public class Event : INotifyPropertyChanged
    {
        public int id { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        public string event_type { get; set; }
        public string dateofevent { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

        private bool _subscribed;
        public bool subscribed
        {
            get => _subscribed;
            set
            {
                if (_subscribed != value)
                {
                    _subscribed = value;
                    OnPropertyChanged(nameof(subscribed));
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
