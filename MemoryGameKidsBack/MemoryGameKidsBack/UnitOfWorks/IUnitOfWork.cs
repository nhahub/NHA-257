using MemoryGameKidsBack.Models;
using MemoryGameKidsBack.Repository;

namespace MemoryGameKidsBack.UnitOfWorks
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<ChildProfile> ChildProfileRepository { get; }
        IRepository<ClinicProfile> ClinicProfileRepository { get; }
        IRepository<DoctorProfile> DoctorProfileRepository { get; }
        IRepository<User> UserRepository { get; }
        IRepository<MemoryScoreSummary> MemoryScoreSummaryRepository { get; }
        IRepository<Game> GameRepository { get; }
        IRepository<GameSession> GameSessionRepository { get; }
        int Complete();
    }
}
