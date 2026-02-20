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
        /// ID del usuario de Supabase
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
