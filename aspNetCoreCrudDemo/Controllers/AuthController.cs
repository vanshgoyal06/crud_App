using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspNetCoreCrudDemo.Data;
using aspNetCoreCrudDemo.Models;
using aspNetCoreCrudDemo.Services;

namespace aspNetCoreCrudDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            var usernameTaken = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if (usernameTaken) return Conflict("Username is already taken.");

            var emailTaken = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailTaken) return Conflict("Email is already registered.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var (token, expiresAt) = _tokenService.GenerateToken(user);
            return Ok(new AuthResponseDto { Token = token, Username = user.Username, ExpiresAt = expiresAt });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            var (token, expiresAt) = _tokenService.GenerateToken(user);
            return Ok(new AuthResponseDto { Token = token, Username = user.Username, ExpiresAt = expiresAt });
        }
    }
}
