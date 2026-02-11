using Application.Common;
using Application.Common.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace FacadeApi.Middleware
{
    /// <summary>
    /// Middleware para manejo global de excepciones
    /// </summary>
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ApiErrorException ex)
            {
                _logger.LogWarning(ex, "API Error: {ErrorCode} - {Message}", 
                    ex.ErrorResponse.ErrorCode, ex.Message);

                await HandleApiErrorException(context, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
                await HandleUnhandledException(context, ex);
            }
        }

        private static async Task HandleApiErrorException(HttpContext context, ApiErrorException ex)
        {
            context.Response.StatusCode = ex.ErrorResponse.HttpCode;
            context.Response.ContentType = "application/json";

            var response = new ApiResponse<object>
            {
                Success = false,
                Message = ex.ErrorResponse.ErrorDescription,
                Data = new
                {
                    errorCode = ex.ErrorResponse.ErrorCode,
                    timestamp = ex.ErrorResponse.Timestamp
                },
                Errors = ex.ErrorResponse.ValidationErrors
            };

            await context.Response.WriteAsJsonAsync(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }

        private static async Task HandleUnhandledException(HttpContext context, Exception ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new ApiResponse<object>
            {
                Success = false,
                Message = ErrorMessages.Get(ErrorCodes.INTERNAL_SERVER_ERROR),
                Data = new
                {
                    errorCode = ErrorCodes.INTERNAL_SERVER_ERROR,
                    timestamp = DateTime.UtcNow
                },
                Errors = null
            };

            await context.Response.WriteAsJsonAsync(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }
    }
}
