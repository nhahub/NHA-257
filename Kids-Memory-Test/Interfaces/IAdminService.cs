using Kids_Memory_Test.DTOs;

namespace Kids_Memory_Test.Interfaces
{
    public interface IAdminService
    {
        Task<AdminStatsDto> GetSystemStatsAsync();
        Task<List<UserSummaryDto>> GetAllUsersAsync();
    }
}