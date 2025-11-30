using Microsoft.AspNetCore.Mvc;
using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Kids_Memory_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <--- REQUIRE LOGIN!
    public class GameSessionController : ControllerBase
    {
        private readonly IGameSessionService _sessionService;

        public GameSessionController(IGameSessionService sessionService)
        {
            _sessionService = sessionService;
        }

        // POST: api/GameSession/start
        [HttpPost("start")]
        public async Task<IActionResult> StartSession([FromBody] StartSessionDto request)
        {
            try
            {
                var sessionId = await _sessionService.StartSessionAsync(request.UserId);
                return Ok(new { message = "Session Started", sessionId = sessionId });
            }
            catch (Exception ex)
            {
                // This catches the RAISERROR from SQL ("User already has an active session")
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/GameSession/end
        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] StartSessionDto request)
        {
            try
            {
                await _sessionService.EndSessionAsync(request.UserId);
                return Ok(new { message = "Session Ended Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        // GET: api/GameSession/active/5
        [HttpGet("active/{userId}")]
        public async Task<IActionResult> GetActiveSession(int userId)
        {
            var sessionId = await _sessionService.GetActiveSessionIdAsync(userId);
            // Returns { "sessionId": 55 } or { "sessionId": null }
            return Ok(new { sessionId = sessionId });
        }
        // POST: api/GameSession/submit
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitScore([FromBody] SubmitScoreDto request)
        {
            try
            {
                await _sessionService.SubmitGameScoreAsync(request);
                return Ok(new { message = "Score Saved Successfully" });
            }
            catch (Exception ex)
            {
                // This catches errors like "No active session found"
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}