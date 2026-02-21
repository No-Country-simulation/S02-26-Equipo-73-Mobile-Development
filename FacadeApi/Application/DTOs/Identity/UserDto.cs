namespace Application.DTOs.Identity
{
    /// <summary>
    /// DTO de respuesta para usuarios (GET)
    /// </summary>
    public class UserDto
    {
        public int Id { get; set; }
        public string SupabaseId { get; set; }
        public string Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        
        /// <summary>
        /// URL de la imagen de perfil
        /// </summary>
        public string? ProfileImageUrl { get; set; }
        
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        /// <summary>
        /// Roles asignados al usuario
        /// </summary>
        public List<RoleDto> Roles { get; set; } = new();
        
        /// <summary>
        /// Nombre completo del usuario
        /// </summary>
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}
