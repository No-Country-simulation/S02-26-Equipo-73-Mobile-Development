namespace Application.DTOs.Auth
{
    /// <summary>
    /// Respuesta con información del usuario autenticado
    /// </summary>
    public class UserInfoResponse
    {
        /// <summary>
        /// ID del usuario
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Email del usuario
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Nombre del usuario
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Rol del usuario
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Estado de autenticación
        /// </summary>
        public bool IsAuthenticated { get; set; }
    }
}
