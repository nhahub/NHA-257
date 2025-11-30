using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Models;

namespace Kids_Memory_Test.Interfaces
{
    public interface IAuthService
    {
        // Returns the created User (or null if failed)
        Task<TblUser> RegisterAsync(RegisterDto request);

        // Returns the User if login success, null if failed
        Task<string?> LoginAsync(LoginDto request);
    }
}