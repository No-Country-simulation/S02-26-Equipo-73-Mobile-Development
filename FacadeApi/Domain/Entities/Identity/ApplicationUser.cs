namespace Domain.Entities.Identity
{
    /// <summary>
    /// Representa un usuario de la aplicación
    /// </summary>
    public class ApplicationUser
    {
        public int Id { get; set; }

        /// <summary>
        /// ID del usuario en Supabase (UUID)
        /// </summary>
        public string SupabaseId { get; set; }

        /// <summary>
        /// Email del usuario (único y requerido)
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Nombre del usuario
        /// </summary>
        public string? FirstName { get; set; }

        /// <summary>
        /// Apellido del usuario
        /// </summary>
        public string? LastName { get; set; }

        /// <summary>
        /// Teléfono del usuario
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// URL de la imagen de perfil
        /// </summary>
        public string? ProfileImageUrl { get; set; }

        /// <summary>
        /// Indica si el usuario está activo
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Indica si el usuario está eliminado (soft delete)
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Roles del usuario
        /// </summary>
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
