using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Models;
using Kids_Memory_Test.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Kids_Memory_Test.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly KidsMemoreyTestDbContext _context;

        public DoctorService(KidsMemoreyTestDbContext context)
        {
            _context = context;
        }

        public async Task<List<DoctorDashboardDto>> GetPatientScoresAsync(int userId)
        {
            // 1. FIRST: Find the REAL DoctorId using the Login UserId
            var doctorProfile = await _context.TblDoctorProfiles
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctorProfile == null)
            {
                // If profile doesn't exist yet, return empty list instead of crashing
                return new List<DoctorDashboardDto>();
            }

            // 2. NOW call the SP using the correct DoctorId (e.g., 1, not 3)
            int realDoctorId = doctorProfile.DoctorId;

            var result = await _context.Database
                .SqlQueryRaw<DoctorDashboardDto>("EXEC sp_GetDoctorDashboard @DoctorId = {0}", realDoctorId)
                .ToListAsync();

            return result;
        }
        public async Task<bool> AssignPatientAsync(int userId, string childEmail)
        {
            // 1. Get Doctor Profile
            var doctorProfile = await _context.TblDoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctorProfile == null) throw new Exception("Please complete your Doctor Profile first.");

            // 2. Find Child Login
            var childUser = await _context.TblUsers.FirstOrDefaultAsync(u => u.Email == childEmail && u.UserTypeId == 3);
            if (childUser == null) throw new Exception("Child email not found.");

            // 3. Find Child Profile
            var childProfile = await _context.TblChildProfiles.FirstOrDefaultAsync(p => p.UserId == childUser.UserId);

            // --- SMART FIX: Create Profile if missing ---
            if (childProfile == null)
            {
                childProfile = new TblChildProfile
                {
                    UserId = childUser.UserId,
                    ChildName = "New Child", // Placeholder name
                    IsDeleted = false
                };
                _context.TblChildProfiles.Add(childProfile);
            }

            // 4. Link to Doctor
            childProfile.DoctorId = doctorProfile.DoctorId;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
