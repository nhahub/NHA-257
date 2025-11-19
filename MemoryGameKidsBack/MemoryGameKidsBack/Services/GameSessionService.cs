using MemoryGameKidsBack.DTOs;
using MemoryGameKidsBack.Models;
using MemoryGameKidsBack.UnitOfWorks;

namespace MemoryGameKidsBack.Services
{
    public class GameSessionService : IGameSessionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public GameSessionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<GetGameSessionDTO> GetGameSessions()
        {
            var getList = _unitOfWork.GameSessionRepository.GetAll();
            List<GetGameSessionDTO> result = new List<GetGameSessionDTO>();
            foreach (var item in getList)
            {
                result.Add(new GetGameSessionDTO()
                {
                    SessionId = item.SessionId,
                    UserId = item.UserId,
                    GameId = item.GameId,
                    StartTime = item.StartTime,
                    EndTime = item.EndTime,
                    Score = item.Score,
                    Trials = item.Trials,
                    Misses = item.Misses,
                    SessionDate = item.SessionDate

                });
            }
            return result;
        }

        public void AddGameSession(PostGameSessionDTO gs)
        {
            _unitOfWork.GameSessionRepository.Add(new GameSession() {
                UserId = gs.UserId,
                GameId = gs.GameId,
                StartTime = gs.StartTime,
                EndTime = gs.EndTime,
                Score = gs.Score,
                Trials = gs.Trials,
                Misses = gs.Misses,
                SessionDate = gs.SessionDate
            });
            _unitOfWork.Complete();
        }
    }
}
