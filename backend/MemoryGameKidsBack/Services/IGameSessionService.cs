using MemoryGameKidsBack.DTOs;

namespace MemoryGameKidsBack.Services
{
    public interface IGameSessionService
    {
        IEnumerable<GetGameSessionDTO> GetGameSessions();
        void AddGameSession(PostGameSessionDTO gs);
    }
}
