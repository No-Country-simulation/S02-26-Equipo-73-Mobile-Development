namespace Domain.Entities.Identity
{
    /// <summary>
    /// Tabla intermedia para la relación muchos a muchos entre ApplicationUser y Role
    /// </summary>
    public class ApplicationUserRole
    {
        public int UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        public int RoleId { get; set; }
        public virtual Role Role { get; set; }

        public DateTime AssignedAt { get; set; }
    }
}
