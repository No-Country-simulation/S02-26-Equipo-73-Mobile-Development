namespace Application.DTOs.Auth
{
    /// <summary>
    /// Información de un claim del JWT
    /// </summary>
    public class ClaimInfoDto
    {
        /// <summary>
        /// Tipo del claim (ej: "sub", "email", "role")
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Valor del claim
        /// </summary>
        public string Value { get; set; }
    }
}
