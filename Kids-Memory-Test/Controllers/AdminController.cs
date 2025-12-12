using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.DTOs;


namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        private readonly IGameSessionService _gameSessionService;

        
        public AdminController(IAdminService adminService, IGameSessionService gameSessionService)
        {
            _adminService = adminService;
            _gameSessionService = gameSessionService;
        }

        // GET: api/Admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            if (!IsAdmin()) return StatusCode(403, "Access Denied");

            var stats = await _adminService.GetSystemStatsAsync();
            return Ok(stats);
        }

        // GET: api/Admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            if (!IsAdmin()) return StatusCode(403, "Access Denied");

            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // Helper to check role
        private bool IsAdmin()
        {
            var role = User.FindFirst("Role")?.Value;
            return role == "1"; // 1 = Admin
        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserDetails(int id)
        {
            var result = await _gameSessionService.GetUserDetailsAsync(id);

            if (result == null) return NotFound("User details not found.");

            return Ok(result);
        }


        [HttpPost("manage-user")]
        public async Task<IActionResult> ManageUser([FromBody] UserActionDto request)
        {
            if (request == null) return BadRequest("Invalid request.");

            await _gameSessionService.ManageUserAsync(request.UserId, request.ActionType);

            // IMPORTANT: Return an OK status
            return Ok(new { message = "Success" });
        }
    }
}
