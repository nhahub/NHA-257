using Kids_Memory_Test.DTOs;
using Kids_Memory_Test.Models;

namespace Kids_Memory_Test.Interfaces
{
    public interface IAuthService
    {
        Task<TblUser> RegisterAsync(RegisterDto request);

        Task<string?> LoginAsync(LoginDto request);
    }
}