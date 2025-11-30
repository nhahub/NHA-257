namespace Kids_Memory_Test.DTOs
{
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public int UserTypeId { get; set; } // 1=Clinic, 2=Doctor, 3=Child
    }
}