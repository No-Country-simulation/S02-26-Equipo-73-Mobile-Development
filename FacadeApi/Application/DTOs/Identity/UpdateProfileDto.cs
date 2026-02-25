using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Identity
{
    /// <summary>
    /// DTO para que el usuario actualice su propio perfil
    /// </summary>
    public class UpdateProfileDto
    {
        [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
        public string? FirstName { get; set; }

        [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
        public string? LastName { get; set; }

        [Phone(ErrorMessage = "Invalid phone format")]
        [MaxLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string? Phone { get; set; }

        /// <summary>
        /// URL de imagen existente o string en base64 para subir una nueva
        /// </summary>
        public string? ProfileImageUrl { get; set; }
    }
}
