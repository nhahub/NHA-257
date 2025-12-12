namespace Kids_Memory_Test.DTOs
{
    public class AdminUserDetailsDto
    {
        public int UserId { get; set; }
        public string? Email { get; set; }
        public int UserTypeId { get; set; }
        public bool IsDeleted { get; set; }

        // Shared & Doctor Fields
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Specialty { get; set; }
        public int? AssociatedCount { get; set; } // For Doctors

        // Child Fields
        public string? ParentName { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AssignedDoctor { get; set; }
    }
}