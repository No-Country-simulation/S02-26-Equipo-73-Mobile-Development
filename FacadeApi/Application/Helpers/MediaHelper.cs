using System.Text.RegularExpressions;

namespace Application.Helpers
{
    /// <summary>
    /// Helper methods for media file validation and processing
    /// </summary>
    public static class MediaHelper
    {
        private static readonly List<string> SupportedImageFormats = new()
        {
            "jpg", "jpeg", "png", "gif", "bmp", "ico", "webp", "x-icon", "svg"
        };

        private static readonly List<string> SupportedVideoFormats = new()
        {
            "mp4", "avi", "mov", "wmv", "flv", "webm"
        };

        /// <summary>
        /// Validates if the data string represents a valid video format
        /// </summary>
        /// <param name="data">Base64 string or URL to validate</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool ValidateVideoFormat(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return false;

            if (data.IsUrl())
                return true; // URLs are considered valid, actual validation happens on download

            try
            {
                var format = data.GetFileExtension();
                return SupportedVideoFormats.Contains(format.ToLower());
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Validates if the data string represents a valid image format
        /// </summary>
        /// <param name="data">Base64 string or URL to validate</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool ValidateImageFormat(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return false;

            if (data.IsUrl())
                return true; // URLs are considered valid

            try
            {
                var format = data.GetFileExtension();
                return SupportedImageFormats.Contains(format.ToLower());
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Extracts the file extension from a base64 data string
        /// </summary>
        /// <param name="data">Base64 data string (e.g., "data:image/png;base64,...")</param>
        /// <returns>File extension without dot</returns>
        public static string GetFileExtension(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                throw new ArgumentException("Data cannot be null or empty", nameof(data));

            if (data.IsUrl())
            {
                // Extract extension from URL
                var uri = new Uri(data);
                var path = uri.AbsolutePath;
                var lastDot = path.LastIndexOf('.');
                return lastDot > 0 ? path.Substring(lastDot + 1).ToLower() : "bin";
            }

            // Extract from base64 string: data:image/png;base64,...
            var match = Regex.Match(data, @"data:[^/]+/([^;]+)", RegexOptions.IgnoreCase);
            if (match.Success)
            {
                var format = match.Groups[1].Value;
                // Handle special cases
                return format switch
                {
                    "svg+xml" => "svg",
                    _ => format.ToLower()
                };
            }

            throw new ArgumentException("Invalid data format", nameof(data));
        }

        /// <summary>
        /// Checks if the string is a valid HTTP/HTTPS URL
        /// </summary>
        /// <param name="data">String to validate</param>
        /// <returns>True if valid URL, false otherwise</returns>
        public static bool IsUrl(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return false;

            return Uri.TryCreate(data, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }

        /// <summary>
        /// Checks if the string is a base64 encoded image
        /// </summary>
        /// <param name="data">String to validate</param>
        /// <returns>True if valid base64 image, false otherwise</returns>
        public static bool IsBase64Image(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return false;

            return Regex.IsMatch(data, @"^data:image\/[a-zA-Z]+;base64,", RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Removes the base64 data prefix from an image string
        /// </summary>
        /// <param name="data">Base64 image string</param>
        /// <returns>Clean base64 string without prefix</returns>
        public static string StripBase64Prefix(this string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return data;

            return Regex.Replace(data, @"^data:image\/[a-zA-Z]+;base64,", string.Empty);
        }

        /// <summary>
        /// Gets the MIME type from file extension
        /// </summary>
        /// <param name="extension">File extension (with or without dot)</param>
        /// <returns>MIME type string</returns>
        public static string GetMimeType(string extension)
        {
            extension = extension.TrimStart('.').ToLower();

            return extension switch
            {
                "jpg" or "jpeg" => "image/jpeg",
                "png" => "image/png",
                "gif" => "image/gif",
                "bmp" => "image/bmp",
                "webp" => "image/webp",
                "svg" => "image/svg+xml",
                "ico" => "image/x-icon",
                "mp4" => "video/mp4",
                "avi" => "video/x-msvideo",
                "mov" => "video/quicktime",
                "webm" => "video/webm",
                _ => "application/octet-stream"
            };
        }

        /// <summary>
        /// Validates file size
        /// </summary>
        /// <param name="data">Base64 string</param>
        /// <param name="maxSizeInMB">Maximum size in megabytes</param>
        /// <returns>True if size is valid, false otherwise</returns>
        public static bool ValidateFileSize(this string data, int maxSizeInMB = 10)
        {
            if (string.IsNullOrWhiteSpace(data) || data.IsUrl())
                return true;

            try
            {
                var cleanData = data.StripBase64Prefix();
                var bytes = Convert.FromBase64String(cleanData);
                var sizeInMB = bytes.Length / (1024.0 * 1024.0);
                return sizeInMB <= maxSizeInMB;
            }
            catch
            {
                return false;
            }
        }
    }
}
