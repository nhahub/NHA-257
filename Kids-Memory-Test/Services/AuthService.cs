using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Models;
using Microsoft.EntityFrameworkCore; 
using BCrypt.Net; 
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration; 

namespace Kids_Memory_Test.Services
{
    public class AuthService : IAuthService
    {
        private readonly KidsMemoreyTestDbContext _context;
        private readonly IConfiguration _configuration; 

        public AuthService(KidsMemoreyTestDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<TblUser> RegisterAsync(RegisterDto request)
        {
            // Check existing email
            if (await _context.TblUsers.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already exists.");

            // Create User Account
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new TblUser
            {
                Email = request.Email,
                UserPassword = passwordHash,
                UserTypeId = request.UserTypeId
            };

            _context.TblUsers.Add(newUser);
            await _context.SaveChangesAsync(); 

            // Create Profile based on Role
            if (request.UserTypeId == 2) // Doctor
            {
                var docProfile = new TblDoctorProfile
                {
                    UserId = newUser.UserId,
                    FullName = request.FullName,
                    Specialty = request.Specialty ?? "General",
                    Address = request.Address,
                    Phone = request.Phone,
                    LicenseNumber = request.LicenseNumber,
                    IsDeleted = false
                };
                _context.TblDoctorProfiles.Add(docProfile);
            }
            else if (request.UserTypeId == 3) 
            {
                var childProfile = new TblChildProfile
                {
                    UserId = newUser.UserId,
                    ChildName = request.FullName,
                    ParentName = request.ParentName ?? "Parent",
                    ParentNumber = request.Phone,
                    Address = request.Address,
                    DateOfBirth = request.DateOfBirth != null ? DateOnly.FromDateTime(request.DateOfBirth.Value) : null,
                    IsDeleted = false
                };
                _context.TblChildProfiles.Add(childProfile);
            }

            // Save Profile
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<string?> LoginAsync(LoginDto request) 
        {
            var user = await _context.TblUsers
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.UserPassword))
            {
                return null;
            }

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(TblUser user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            var claims = new List<Claim>
        {
            new Claim("UserId", user.UserId.ToString()),
            new Claim("Role", user.UserTypeId.ToString() ?? "3"), 
            new Claim(ClaimTypes.Email, user.Email)
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2), // Token valid for 2 hours
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}