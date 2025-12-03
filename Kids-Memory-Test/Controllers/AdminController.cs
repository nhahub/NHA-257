using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
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
    }
}
