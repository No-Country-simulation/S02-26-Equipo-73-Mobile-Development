using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Identity
{
    /// <summary>
    /// DTO para crear un nuevo usuario (POST)
    /// </summary>
    public class CreateUserDto
    {
        /// <summary>
        /// ID del usuario en Supabase (UUID)
        /// </summary>
        [Required(ErrorMessage = "Supabase ID is required")]
        public string SupabaseId { get; set; }

        /// <summary>
        /// Email del usuario (requerido y único)
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        
        /// <summary>
        /// Base64 de la imagen de perfil (opcional)
        /// </summary>
        public string? ProfileImage { get; set; }
        
        /// <summary>
        /// IDs de roles a asignar (opcional, default: rol "User")
        /// </summary>
        public List<int> RoleIds { get; set; } = new();
    }
}
