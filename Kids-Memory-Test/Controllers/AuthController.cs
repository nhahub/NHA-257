using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Interfaces;

namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;


        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            try
            {
                var user = await _authService.RegisterAsync(request);
                return Ok(new { message = "User registered successfully!", userId = user.UserId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var token = await _authService.LoginAsync(request);

            if (token == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Return the Token to the Frontend
            return Ok(new
            {
                message = "Login successful!",
                token = token 
            });
        }
    
    }
}