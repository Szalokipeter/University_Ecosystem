using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Collections.ObjectModel;
using UniversityApp.Models;
using UniversityApp.Services;

namespace UniversityApp.ViewModels
{
    public class PersonalEventsListViewModel
    {
        public ObservableCollection<PersonalEventsModel> PersonalEvents { get; set; }

        public PersonalEventsListViewModel()
        {
            PersonalEvents = new ObservableCollection<PersonalEventsModel>();
            getAllPersonalEvents();
        }

        private async void getAllPersonalEvents()
        {
            IEnumerable<PersonalEventsModel> list = await Dataservice.getAllPersonalEvents();
            PersonalEvents.Clear();
            list.ToList().ForEach(book => PersonalEvents.Add(book));
        }
    }
}
