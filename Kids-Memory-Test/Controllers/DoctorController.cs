using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Services;
using Kids_Memory_Test.Models;
using Microsoft.EntityFrameworkCore; 

namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly FlaskMLClient _mlClient;
        private readonly KidsMemoreyTestDbContext _context; 

        public DoctorController(IDoctorService doctorService, FlaskMLClient mlClient, KidsMemoreyTestDbContext context)
        {
            _doctorService = doctorService;
            _mlClient = mlClient;
            _context = context; 
        }

        // GET PROFILE 
        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdString = User.FindFirst("UserId")?.Value;
            int userId = int.Parse(userIdString!);

            // Now _context works because we injected it!
            var profile = await _context.TblDoctorProfiles
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (profile == null) return NotFound("Profile not found");

            return Ok(new
            {
                fullName = profile.FullName,
                phone = profile.Phone,
                specialty = profile.Specialty
            });
        }

        // GET DASHBOARD 
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userIdString = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            int doctorId = int.Parse(userIdString);

            var data = await _doctorService.GetPatientScoresAsync(doctorId);
            return Ok(data);
        }

        // ASSIGN PATIENT
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

        //  GET AI INSIGHT
        [HttpGet("predict/{childId}")]
        public async Task<IActionResult> GetAIInsight(int childId)
        {
            var userIdString = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
            int doctorId = int.Parse(userIdString);

            var allPatients = await _doctorService.GetPatientScoresAsync(doctorId);
            var childHistory = allPatients.Where(p => p.ChildId == childId).ToList();

            if (!childHistory.Any()) return Ok(new { insight = "No game data available yet." });

            int age = 10;
            string gender = "Male";

            string insight = await _mlClient.GetImprovementPredictionAsync(childHistory, age, gender);

            return Ok(new { insight = insight });
        }
    }
}