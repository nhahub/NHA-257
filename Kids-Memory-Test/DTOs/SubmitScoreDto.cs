namespace Kids_Memory_Test.DTOs
{
    public class SubmitScoreDto
    {
        public int UserId { get; set; }
        public int GameId { get; set; } 
        public int Score { get; set; }
        public int Trials { get; set; } 
        public int Misses { get; set; } 
    }
}
