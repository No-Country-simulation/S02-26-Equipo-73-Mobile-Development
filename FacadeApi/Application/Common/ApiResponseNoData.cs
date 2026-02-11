namespace Application.Common
{
    public class ApiResponseNoData
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string>? Errors { get; set; }

        public static ApiResponseNoData Ok(string message = "Operation successful")
        {
            return new ApiResponseNoData
            {
                Success = true,
                Message = message
            };
        }

        public static ApiResponseNoData Fail(string message)
        {
            return new ApiResponseNoData
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponseNoData Fail(string message, List<string> errors)
        {
            return new ApiResponseNoData
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }

        public static ApiResponseNoData NotFound(string message = "Resource not found")
        {
            return new ApiResponseNoData
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponseNoData BadRequest(string message = "Invalid request")
        {
            return new ApiResponseNoData
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponseNoData BadRequest(string message, List<string> errors)
        {
            return new ApiResponseNoData
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }
    }
}
