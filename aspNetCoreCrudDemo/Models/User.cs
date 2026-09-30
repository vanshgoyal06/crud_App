using System.ComponentModel.DataAnnotations;

namespace aspNetCoreCrudDemo.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        // BCrypt hash — never store or return the plain password
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
