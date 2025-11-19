using MemoryGameKidsBack.Models;
using MemoryGameKidsBack.Repository;
using Microsoft.EntityFrameworkCore;
using System;

namespace MemoryGameKidsBack.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {

        private readonly KidsMemoreyTestDBContext _context;
        public IRepository<ChildProfile> ChildProfileRepository { get; }

        public IRepository<ClinicProfile> ClinicProfileRepository { get; }

        public IRepository<DoctorProfile> DoctorProfileRepository { get; }

        public IRepository<User> UserRepository { get; }

        public IRepository<MemoryScoreSummary> MemoryScoreSummaryRepository { get; }

        public IRepository<Game> GameRepository { get; }

        public IRepository<GameSession> GameSessionRepository { get; }

        public UnitOfWork(KidsMemoreyTestDBContext context,
                          IRepository<ChildProfile> childProfileRepository,
                          IRepository<ClinicProfile> clinicProfileRepository,
                          IRepository<DoctorProfile> doctorProfileRepository, 
                          IRepository<User> userRepository,
                          IRepository<MemoryScoreSummary> memoryScoreSummaryRepository,
                          IRepository<Game> gameRepository,
                          IRepository<GameSession> gameSessionRepository)
        {
            _context = context;
            ChildProfileRepository = childProfileRepository ?? throw new ArgumentNullException(nameof(childProfileRepository));
            ClinicProfileRepository = clinicProfileRepository ?? throw new ArgumentNullException(nameof(clinicProfileRepository));
            DoctorProfileRepository = doctorProfileRepository ?? throw new ArgumentNullException(nameof(doctorProfileRepository));
            UserRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            MemoryScoreSummaryRepository = memoryScoreSummaryRepository ?? throw new ArgumentNullException(nameof(memoryScoreSummaryRepository));
            GameRepository = gameRepository ?? throw new ArgumentNullException(nameof(gameRepository));
            GameSessionRepository = gameSessionRepository ?? throw new ArgumentNullException(nameof(gameSessionRepository));
        }

        public int Complete()
        {
            var rows = _context.SaveChanges();
            _context.ChangeTracker.Clear();
            return rows;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
