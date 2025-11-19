using MemoryGameKidsBack.DTOs;
using MemoryGameKidsBack.Services;
using Microsoft.AspNetCore.Mvc;

namespace MemoryGameKidsBack.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameSessionController : ControllerBase
    {
        private readonly IGameSessionService _service;
        public GameSessionController(IGameSessionService service)
        {
            this._service = service;
        }

        [HttpGet]
        public IEnumerable<GetGameSessionDTO> GetGameSessions()
        {
            return _service.GetGameSessions();
        }

        [HttpPost]
        public void AddGameSession(PostGameSessionDTO gameSessionDTO)
        {
            _service.AddGameSession(gameSessionDTO);
        }

    }
}
