namespace Infrastructure.JWT
{
    /// <summary>
    /// Configuración para generación de JWT propios
    /// </summary>
    public class JwtSettings
    {
        /// <summary>
        /// Clave secreta para firmar el JWT
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// Issuer del token (tu API)
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        /// Audience del token
        /// </summary>
        public string Audience { get; set; }

        /// <summary>
        /// Tiempo de expiración en minutos (default: 1440 = 24 horas)
        /// </summary>
        public int ExpirationInMinutes { get; set; } = 1440;

        /// <summary>
        /// Tiempo de expiración del refresh token en días (default: 7 días)
        /// </summary>
        public int RefreshTokenExpirationInDays { get; set; } = 7;
    }
}
