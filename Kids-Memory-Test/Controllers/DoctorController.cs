using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Services; 

namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly FlaskMLClient _mlClient;

        // --- CONSTRUCTOR ---
        public DoctorController(IDoctorService doctorService, FlaskMLClient mlClient)
        {
            _doctorService = doctorService;
            _mlClient = mlClient;
        }

        // --- GET DASHBOARD ---
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userIdString = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            int doctorId = int.Parse(userIdString);

            var data = await _doctorService.GetPatientScoresAsync(doctorId);
            return Ok(data);
        }

        // --- ASSIGN PATIENT ---
        [HttpPost("assign")]
        public async Task<IActionResult> AssignPatient([FromBody] AssignPatientDto request)
        {
            var roleClaim = User.FindFirst("Role")?.Value;
            if (roleClaim != "2")
            {
                return StatusCode(403, new { message = "Access Denied. Doctors only." });
            }

            var userIdString = User.FindFirst("UserId")?.Value;
            int doctorId = int.Parse(userIdString!);

            try
            {
                await _doctorService.AssignPatientAsync(doctorId, request.ChildEmail);
                return Ok(new { message = "Patient linked successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // --- GET AI INSIGHT ---
        [HttpGet("predict/{childId}")]
        public async Task<IActionResult> GetAIInsight(int childId)
        {
            var userIdString = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
            int doctorId = int.Parse(userIdString);

            // 1. Get History
            var allPatients = await _doctorService.GetPatientScoresAsync(doctorId);
            var childHistory = allPatients.Where(p => p.ChildId == childId).ToList();

            if (!childHistory.Any()) return Ok(new { insight = "No game data available yet." });

            // 2. Mock Age/Gender (Replace with real data later)
            int age = 10;
            string gender = "Male";

            // 3. Call Python
            string insight = await _mlClient.GetImprovementPredictionAsync(childHistory, age, gender);

            return Ok(new { insight = insight });
        }
    }
}