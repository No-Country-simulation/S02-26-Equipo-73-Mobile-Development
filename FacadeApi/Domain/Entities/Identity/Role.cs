namespace Domain.Entities.Identity
{
    /// <summary>
    /// Representa un rol del sistema
    /// </summary>
    public class Role
    {
        public int Id { get; set; }

        /// <summary>
        /// Nombre del rol (ej: "Admin", "User", "Manager")
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Nombre normalizado en mayúsculas (ej: "ADMIN", "USER")
        /// </summary>
        public string NormalizedName { get; set; }

        /// <summary>
        /// Descripción del rol
        /// </summary>
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Usuarios con este rol
        /// </summary>
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
