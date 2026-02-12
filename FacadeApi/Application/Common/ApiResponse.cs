namespace Application.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public static ApiResponse<T> Ok(T data, string message = "Operation successful")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message
            };
        }

        public static ApiResponse<T> Fail(string message)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponse<T> Fail(string message, List<string> errors)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }

        public static ApiResponse<T> NotFound(string message = "Resource not found")
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponse<T> BadRequest(string message = "Invalid request")
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message
            };
        }

        public static ApiResponse<T> BadRequest(string message, List<string> errors)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }
    }
}
