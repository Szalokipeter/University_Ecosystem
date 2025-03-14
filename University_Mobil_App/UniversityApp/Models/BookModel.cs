using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UniversityApp.Models
{
    public class PersonalEventsModel
    {
        private string imageName;

        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string RealYears { get; set; }
        public int Year { get; set; }
        public string Country { get; set; }
        public string Language { get; set; }
        public int Pages { get; set; }
        public string ImageName { 
            get => "https://bgs.jedlik.eu/book100/"+imageName; 
            set => imageName = value; 
        }
        public string WikipediaLink { get; set; }

    }
}
