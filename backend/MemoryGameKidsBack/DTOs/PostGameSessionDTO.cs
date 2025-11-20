using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemoryGameKidsBack.DTOs
{
    public class PostGameSessionDTO
    {
        [Required(ErrorMessage = "Must Enter UserID")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Must Enter GameID")]
        public int GameId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        [Required(ErrorMessage = "Must Enter Score")]
        public int Score { get; set; }
        [Required(ErrorMessage = "Must Enter Trials")]
        public int Trials { get; set; }
        [Required(ErrorMessage = "Must Enter Misses")]
        public int Misses { get; set; }
        [Required(ErrorMessage = "Must Enter SessionDate")]
        public DateOnly SessionDate { get; set; }
    }
}
