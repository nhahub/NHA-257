using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Models;
using Microsoft.EntityFrameworkCore;
using Kids_Memory_Test.DTOs;


namespace Kids_Memory_Test.Services
{
    public class SessionResult
    {
        public int SessionId { get; set; }
    }

    public class GameSessionService : IGameSessionService
    {
        private readonly KidsMemoreyTestDbContext _context;

        public GameSessionService(KidsMemoreyTestDbContext context)
        {
            _context = context;
        }

        public async Task<int> StartSessionAsync(int userId)
        {
            var result = await _context.Database
                .SqlQueryRaw<SessionResult>("EXEC sp_StartGamingSession @UserId = {0}", userId)
                .ToListAsync();

            var session = result.FirstOrDefault();
            if (session != null)
            {
                return session.SessionId;
            }

            throw new Exception("Failed to start session. Ensure user is a Child.");
        }

        public async Task<bool> EndSessionAsync(int userId)
        {
            await _context.Database
                .ExecuteSqlRawAsync("EXEC sp_EndGamingSession @UserId = {0}", userId);

            return true;
        }
        public async Task<int?> GetActiveSessionIdAsync(int userId)
        {
            // Call the Helper SP you created in SQL
            var result = await _context.Database
                .SqlQueryRaw<SessionResult>("EXEC sp_GetActiveSession @UserId = {0}", userId)
                .ToListAsync();

            // Return the ID if found, otherwise null
            return result.FirstOrDefault()?.SessionId;
        }

        public async Task<bool> SubmitGameScoreAsync(SubmitScoreDto score)
        {
            // This calls your Stored Procedure: sp_AddGameToSession
            // The SP automatically finds the Active Session ID, so we don't need to send it!
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_AddGameToSession @UserId={0}, @GameId={1}, @Score={2}, @Trials={3}, @Misses={4}",
                score.UserId,
                score.GameId,
                score.Score,
                score.Trials,
                score.Misses
            );

            return true;
        }
        public async Task<AdminUserDetailsDto?> GetUserDetailsAsync(int userId)
        {
            var result = await _context.AdminUserDetails
                .FromSqlRaw("EXEC sp_Admin_GetUserDetails @UserId = {0}", userId)
                .ToListAsync();

            return result.FirstOrDefault();
        }

        // 2. MANAGE USER (Calls sp_Admin_ManageUser)
        public async Task ManageUserAsync(int userId, string actionType)
        {
            // Validate ActionType to prevent SQL injection or errors
            var validActions = new[] { "DEACTIVATE", "ACTIVATE", "DELETE" };
            if (!validActions.Contains(actionType))
            {
                throw new ArgumentException("Invalid action type.");
            }

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_Admin_ManageUser @UserId = {0}, @ActionType = {1}",
                userId, actionType
            );
        }
    }
}