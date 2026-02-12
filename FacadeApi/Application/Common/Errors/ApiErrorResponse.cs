using System.Net;

namespace Application.Common.Errors
{
    /// <summary>
    /// Respuesta de error de la API
    /// </summary>
    public class ApiErrorResponse
    {
        public int HttpCode { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorDescription { get; set; }
        public List<string>? ValidationErrors { get; set; }
        public DateTime Timestamp { get; set; }

        public ApiErrorResponse(int httpCode, string errorCode, string errorDescription)
        {
            HttpCode = httpCode;
            ErrorCode = errorCode;
            ErrorDescription = errorDescription;
            Timestamp = DateTime.UtcNow;
        }

        public ApiErrorResponse(HttpStatusCode httpCode, string errorCode, string errorDescription)
            : this((int)httpCode, errorCode, errorDescription)
        {
        }

        public ApiErrorResponse(int httpCode, string errorCode)
            : this(httpCode, errorCode, ErrorMessages.Get(errorCode))
        {
        }

        public ApiErrorResponse(HttpStatusCode httpCode, string errorCode)
            : this((int)httpCode, errorCode, ErrorMessages.Get(errorCode))
        {
        }

        public ApiErrorResponse WithValidationErrors(List<string> validationErrors)
        {
            ValidationErrors = validationErrors;
            return this;
        }
    }
}
