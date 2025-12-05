namespace Kids_Memory_Test.DTOs
{
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public int UserTypeId { get; set; } // 1=Admin, 2=Doctor, 3=Child

        // --- OPTIONAL FIELDS ---
        public string? Address { get; set; }
        public string? Phone { get; set; }

        // For Doctors Only
        public string? Specialty { get; set; }
        public string? LicenseNumber { get; set; }

        // For Kids Only
        public string? ParentName { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}