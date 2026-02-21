using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Identity
{
    /// <summary>
    /// DTO para actualizar un usuario (PUT)
    /// </summary>
    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        
        [Phone(ErrorMessage = "Invalid phone format")]
        public string? Phone { get; set; }
        
        /// <summary>
        /// Base64 de imagen nueva o URL de imagen existente
        /// - Base64: Se sube nueva imagen
        /// - URL: Se mantiene la imagen existente
        /// </summary>
        public string? ProfileImage { get; set; }
        
        public bool? IsActive { get; set; }
        
        /// <summary>
        /// IDs de roles a asignar (opcional)
        /// </summary>
        public List<int>? RoleIds { get; set; }
    }
}
