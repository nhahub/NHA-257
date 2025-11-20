using System.ComponentModel.DataAnnotations;

namespace MemoryGameKidsBack.DTOs
{
    public class GetGameSessionDTO
    {
   
        public int SessionId { get; set; }
        public int? UserId { get; set; }
        public int? GameId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? Score { get; set; }
        public int? Trials { get; set; }
        public int? Misses { get; set; }
        public DateOnly? SessionDate { get; set; }
    }
}
