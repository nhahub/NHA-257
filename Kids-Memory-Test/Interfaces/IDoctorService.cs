using Kids_Memory_Test.DTOs;

namespace Kids_Memory_Test.Interfaces
{
    public interface IDoctorService
    {
        Task<List<DoctorDashboardDto>> GetPatientScoresAsync(int doctorId);
        Task<bool> AssignPatientAsync(int doctorId, string childEmail);
    }
}
