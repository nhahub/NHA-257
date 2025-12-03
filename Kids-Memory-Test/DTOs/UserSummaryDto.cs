namespace Kids_Memory_Test.DTOs
{
    public class UserSummaryDto
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public string FullName { get; set; }
        public string Specialty { get; set; } 
        public string Address { get; set; }
        public string Phone { get; set; }
        public DateOnly? DateOfBirth { get; set; } 
        public int AssignedCount { get; set; } 
    }
}