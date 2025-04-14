using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UniMobile.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Status { get; set; }
        public int UniUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
