using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Interfaces;
using Kids_Memory_Test.Models;
using Microsoft.EntityFrameworkCore;

namespace Kids_Memory_Test.Services
{
    public class AdminService : IAdminService
    {
        private readonly KidsMemoreyTestDbContext _context;

        public AdminService(KidsMemoreyTestDbContext context)
        {
            _context = context;
        }

        public async Task<AdminStatsDto> GetSystemStatsAsync()
        {
            return new AdminStatsDto
            {
                TotalDoctors = await _context.TblUsers.CountAsync(u => u.UserTypeId == 2),
                TotalChildren = await _context.TblUsers.CountAsync(u => u.UserTypeId == 3),
                TotalGamesPlayed = await _context.TblGameSessions.CountAsync(),
                TotalActiveSessions = await _context.TblMemoryScoreSummaries.CountAsync(s => s.IsActive == true)
            };
        }

        public async Task<List<UserSummaryDto>> GetAllUsersAsync()
        {
            // 1. Fetch all raw data separately (This avoids complex SQL translation errors)
            var allUsers = await _context.TblUsers.ToListAsync();
            var allDoctors = await _context.TblDoctorProfiles.ToListAsync();
            var allChildren = await _context.TblChildProfiles.ToListAsync();

            // 2. Join them in memory (C# Logic)
            var result = allUsers.Select(u =>
            {
                // Find the matching profiles in the lists we just fetched
                var docProfile = allDoctors.FirstOrDefault(d => d.UserId == u.UserId);
                var childProfile = allChildren.FirstOrDefault(c => c.UserId == u.UserId);

                return new UserSummaryDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    Role = u.UserTypeId == 1 ? "Admin" : (u.UserTypeId == 2 ? "Doctor" : "Child"),
                    IsActive = !u.IsDeleted.GetValueOrDefault(),

                    // Map fields based on role
                    FullName = u.UserTypeId == 2 ? docProfile?.FullName : childProfile?.ChildName,
                    Address = u.UserTypeId == 2 ? docProfile?.Address : childProfile?.Address,
                    Phone = u.UserTypeId == 2 ? docProfile?.Phone : childProfile?.ParentNumber,
                    Specialty = u.UserTypeId == 2 ? docProfile?.Specialty : null,
                    DateOfBirth = u.UserTypeId == 3 ? childProfile?.DateOfBirth : null,

                    // Count assigned kids (Only for Doctors)
                    // We count how many children have this Doctor's ID
                    AssignedCount = u.UserTypeId == 2 && docProfile != null
                        ? allChildren.Count(c => c.DoctorId == docProfile.DoctorId)
                        : 0
                };
            }).ToList();

            return result;
        }
    }
}