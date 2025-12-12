namespace Kids_Memory_Test.DTOs
{
    public class UserActionDto
    {
        public int UserId { get; set; }
        // Values: "DEACTIVATE", "ACTIVATE", "DELETE"
        public string? ActionType { get; set; }
    }
}