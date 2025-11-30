using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Models;
using Microsoft.EntityFrameworkCore; 
using BCrypt.Net; //  for hashing
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration; // To read appsettings

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
            
            if (await _context.TblUsers.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already exists.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new TblUser
            {
                Email = request.Email,
                UserPassword = passwordHash,
                UserTypeId = request.UserTypeId
            };

            _context.TblUsers.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<string?> LoginAsync(LoginDto request) // <--- CHANGED Return Type to string? (The Token)
        {
            var user = await _context.TblUsers
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.UserPassword))
            {
                return null;
            }

            // --- NEW: Generate JWT Token ---
            return GenerateJwtToken(user);
        }

        // --- NEW HELPER METHOD ---
        private string GenerateJwtToken(TblUser user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            var claims = new List<Claim>
        {
            new Claim("UserId", user.UserId.ToString()),
            new Claim("Role", user.UserTypeId.ToString() ?? "3"), // Default to Child if null
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