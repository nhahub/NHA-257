namespace Kids_Memory_Test.DTOs
{
    public class SubmitScoreDto
    {
        public int UserId { get; set; }
        public int GameId { get; set; } // e.g., 1 for Simon Says
        public int Score { get; set; }
        public int Trials { get; set; } // How many attempts?
        public int Misses { get; set; } // How many mistakes?
    }
}
