namespace Application.DTOs.Auth
{
    /// <summary>
    /// Respuesta del endpoint de exchange de token
    /// </summary>
    public class AuthExchangeResponse
    {
        /// <summary>
        /// Indica si el usuario está autenticado
        /// </summary>
        public bool IsAuthenticated { get; set; }

        /// <summary>
        /// ID del usuario en Supabase (UUID)
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// ID interno del usuario en la base de datos
        /// </summary>
        public int InternalUserId { get; set; }

        /// <summary>
        /// Email del usuario
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Nombre completo del usuario
        /// </summary>
        public string Name { get; set; }

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
        /// Rol principal del usuario
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Lista de todos los roles del usuario
        /// </summary>
        public List<string> Roles { get; set; }

        /// <summary>
        /// JWT de la API (usa este token para futuras peticiones)
        /// </summary>
        public string AccessToken { get; set; }

        /// <summary>
        /// Refresh token para renovar el access token
        /// </summary>
        public string RefreshToken { get; set; }

        /// <summary>
        /// Tipo de token (siempre "Bearer")
        /// </summary>
        public string TokenType { get; set; }

        /// <summary>
        /// Tiempo de expiración en segundos (24 horas = 86400)
        /// </summary>
        public int ExpiresIn { get; set; }

        /// <summary>
        /// Claims adicionales del token JWT de Supabase
        /// </summary>
        public List<ClaimInfoDto> Claims { get; set; }
    }
}
