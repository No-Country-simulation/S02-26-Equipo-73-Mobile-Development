namespace Application.DTOs.Auth
{
    /// <summary>
    /// Respuesta del check de autenticación
    /// </summary>
    public class AuthCheckResponse
    {
        /// <summary>
        /// Indica si el usuario está autenticado
        /// </summary>
        public bool IsAuthenticated { get; set; }

        /// <summary>
        /// ID del usuario autenticado
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Mensaje descriptivo
        /// </summary>
        public string Message { get; set; }
    }
}
