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

        public async Task<List<DoctorDashboardDto>> GetPatientScoresAsync(int doctorId)
        {
            // Call the Stored Procedure: sp_GetDoctorDashboard
            var result = await _context.Database
                .SqlQueryRaw<DoctorDashboardDto>("EXEC sp_GetDoctorDashboard @DoctorId = {0}", doctorId)
                .ToListAsync();

            return result;
        }
        public async Task<bool> AssignPatientAsync(int userId, string childEmail)
        {
            // 1. FIRST: Find the actual Doctor Profile using the Login User ID
            var doctorProfile = await _context.TblDoctorProfiles
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctorProfile == null)
                throw new Exception("Doctor profile not found. Please contact admin.");

            // 2. Find the Child User
            var childUser = await _context.TblUsers
                .FirstOrDefaultAsync(u => u.Email == childEmail && u.UserTypeId == 3);

            if (childUser == null)
                throw new Exception("Child email not found or user is not a child.");

            // 3. Find the Child Profile
            var childProfile = await _context.TblChildProfiles
                .FirstOrDefaultAsync(p => p.UserId == childUser.UserId);

            if (childProfile == null)
                throw new Exception("Child profile not found.");

            // 4. Update the Link (Use the REAL DoctorId from the profile)
            childProfile.DoctorId = doctorProfile.DoctorId;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
