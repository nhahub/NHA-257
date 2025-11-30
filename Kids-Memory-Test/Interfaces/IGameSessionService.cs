using Kids_Memory_Test.DTOs;

namespace Kids_Memory_Test.Interfaces
{
    public interface IGameSessionService
    {
        // Calls sp_StartGamingSession
        Task<int> StartSessionAsync(int userId);

        // Calls sp_EndGamingSession
        Task<bool> EndSessionAsync(int userId);
        Task<int?> GetActiveSessionIdAsync(int userId);
        Task<bool> SubmitGameScoreAsync(SubmitScoreDto score);
    }
}