namespace Application.DTOs.Identity
{
    /// <summary>
    /// DTO de respuesta para roles
    /// </summary>
    public class RoleDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string? Description { get; set; }
    }
}
