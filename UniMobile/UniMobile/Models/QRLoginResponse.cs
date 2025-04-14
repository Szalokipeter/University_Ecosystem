using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UniMobile.Models
{
    public class QRLoginResponse
    {
        [JsonProperty("status")]
        public string Status { get; set; }
    }
}
