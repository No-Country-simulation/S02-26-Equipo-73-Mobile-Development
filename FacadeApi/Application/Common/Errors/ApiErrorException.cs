using System.Net;

namespace Application.Common.Errors
{
    /// <summary>
    /// Excepción personalizada de la API con código de error estandarizado
    /// </summary>
    public sealed class ApiErrorException : Exception
    {
        public ApiErrorResponse ErrorResponse { get; set; }

        /// <summary>
        /// Crea una excepción con código de error estandarizado
        /// </summary>
        public ApiErrorException(HttpStatusCode httpCode, string errorCode)
            : base(ErrorMessages.Get(errorCode))
        {
            ErrorResponse = new ApiErrorResponse(httpCode, errorCode);
        }

        /// <summary>
        /// Crea una excepción con código de error y mensaje personalizado
        /// </summary>
        public ApiErrorException(HttpStatusCode httpCode, string errorCode, string customMessage)
            : base(customMessage)
        {
            ErrorResponse = new ApiErrorResponse(httpCode, errorCode, customMessage);
        }

        /// <summary>
        /// Crea una excepción con código de error y errores de validación
        /// </summary>
        public ApiErrorException(HttpStatusCode httpCode, string errorCode, List<string> validationErrors)
            : base(ErrorMessages.Get(errorCode))
        {
            ErrorResponse = new ApiErrorResponse(httpCode, errorCode)
                .WithValidationErrors(validationErrors);
        }

        /// <summary>
        /// Crea una excepción con una respuesta de error completa
        /// </summary>
        public ApiErrorException(ApiErrorResponse errorResponse)
            : base(errorResponse.ErrorDescription)
        {
            ErrorResponse = errorResponse;
        }

        /// <summary>
        /// Crea una excepción con una respuesta de error y excepción interna
        /// </summary>
        public ApiErrorException(ApiErrorResponse errorResponse, Exception? inner)
            : base(errorResponse.ErrorDescription, inner)
        {
            ErrorResponse = errorResponse;
        }

        // Helper methods para errores comunes
        public static ApiErrorException NotFound(string errorCode) =>
            new(HttpStatusCode.NotFound, errorCode);

        public static ApiErrorException NotFound(string errorCode, string message) =>
            new(HttpStatusCode.NotFound, errorCode, message);

        public static ApiErrorException BadRequest(string errorCode) =>
            new(HttpStatusCode.BadRequest, errorCode);

        public static ApiErrorException BadRequest(string errorCode, string message) =>
            new(HttpStatusCode.BadRequest, errorCode, message);

        public static ApiErrorException BadRequest(string errorCode, List<string> validationErrors) =>
            new(HttpStatusCode.BadRequest, errorCode, validationErrors);

        public static ApiErrorException Conflict(string errorCode) =>
            new(HttpStatusCode.Conflict, errorCode);

        public static ApiErrorException Conflict(string errorCode, string message) =>
            new(HttpStatusCode.Conflict, errorCode, message);

        public static ApiErrorException InternalServerError(string errorCode) =>
            new(HttpStatusCode.InternalServerError, errorCode);

        public static ApiErrorException InternalServerError(string errorCode, string message) =>
            new(HttpStatusCode.InternalServerError, errorCode, message);
    }
}
