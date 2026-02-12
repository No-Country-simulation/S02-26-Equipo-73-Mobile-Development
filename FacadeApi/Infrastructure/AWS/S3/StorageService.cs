using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Application.Common.Errors;
using Application.Helpers;
using Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Text.RegularExpressions;

namespace Infrastructure.AWS.S3
{
    /// <summary>
    /// Implementation of IStorageService for AWS S3 and MinIO
    /// </summary>
    public class StorageService : IStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly StorageSettings _settings;
        private readonly ILogger<StorageService> _logger;

        public StorageService(
            IAmazonS3 s3Client, 
            IOptions<StorageSettings> settings,
            ILogger<StorageService> logger)
        {
            _s3Client = s3Client ?? throw new ArgumentNullException(nameof(s3Client));
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Uploads a file to S3/MinIO storage
        /// </summary>
        public async Task UploadFileAsync(string key, Stream fileStream, string contentType)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));

            if (fileStream == null)
                throw new ArgumentNullException(nameof(fileStream));

            if (string.IsNullOrWhiteSpace(contentType))
                throw new ArgumentException("Content type cannot be null or empty.", nameof(contentType));

            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _settings.BucketName,
                    Key = key,
                    InputStream = fileStream,
                    ContentType = contentType,
                    CannedACL = S3CannedACL.PublicRead // Make file publicly accessible
                };

                var response = await _s3Client.PutObjectAsync(putRequest);

                if (response.HttpStatusCode != HttpStatusCode.OK)
                {
                    throw ApiErrorException.InternalServerError(
                        ErrorCodes.EXTERNAL_SERVICE_ERROR,
                        $"Failed to upload file to S3. Status: {response.HttpStatusCode}");
                }

                _logger.LogInformation("File uploaded successfully: {Key}", key);
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "S3 error uploading file {Key}", key);
                throw ApiErrorException.InternalServerError(
                    ErrorCodes.EXTERNAL_SERVICE_ERROR,
                    $"S3 error: {ex.Message}");
            }
            catch (Exception ex) when (ex is not ApiErrorException)
            {
                _logger.LogError(ex, "Unexpected error uploading file {Key}", key);
                throw;
            }
        }

        /// <summary>
        /// Processes an image URL or base64 string
        /// </summary>
        public async Task<string> ProcessImageUrl(string cdnUrl, string imageUrl, string folder)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                _logger.LogWarning("Empty image URL provided");
                return null;
            }

            // If it's already a URL, return it
            if (imageUrl.IsUrl())
            {
                _logger.LogDebug("Image is already a URL: {ImageUrl}", imageUrl);
                return imageUrl;
            }

            // Validate image format
            if (!imageUrl.ValidateImageFormat())
            {
                _logger.LogWarning("Invalid image format for: {ImageUrl}", imageUrl.Substring(0, Math.Min(50, imageUrl.Length)));
                throw ApiErrorException.BadRequest(
                    ErrorCodes.VALIDATION_ERROR,
                    "Invalid image format. Supported formats: jpg, jpeg, png, gif, bmp, webp, svg");
            }

            // Validate file size (10MB max by default)
            if (!imageUrl.ValidateFileSize(10))
            {
                throw ApiErrorException.BadRequest(
                    ErrorCodes.VALIDATION_ERROR,
                    "Image size exceeds the maximum allowed (10MB)");
            }

            try
            {
                // Upload base64 image
                string uploadedUrl = await UploadBase64Image(
                    _settings.BucketName, 
                    cdnUrl, 
                    imageUrl, 
                    folder);

                _logger.LogInformation("Image processed successfully: {Url}", uploadedUrl);
                return uploadedUrl;
            }
            catch (Exception ex) when (ex is not ApiErrorException)
            {
                _logger.LogError(ex, "Error processing image");
                throw ApiErrorException.InternalServerError(
                    ErrorCodes.EXTERNAL_SERVICE_ERROR,
                    "Failed to process image");
            }
        }

        /// <summary>
        /// Simplified version - processes image using configured settings
        /// </summary>
        public async Task<string> ProcessImageUrlAsync(string imageData, string folder)
        {
            var cdnUrl = !string.IsNullOrWhiteSpace(_settings.Cdn) 
                ? _settings.Cdn 
                : _settings.Endpoint;

            return await ProcessImageUrl(cdnUrl, imageData, folder);
        }

        /// <summary>
        /// Deletes a file from storage
        /// </summary>
        public async Task DeleteFileAsync(string bucketName, string filename)
        {
            if (string.IsNullOrWhiteSpace(bucketName))
                throw new ArgumentException("Bucket name cannot be null or empty.", nameof(bucketName));

            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentException("Filename cannot be null or empty.", nameof(filename));

            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = filename
                };

                var response = await _s3Client.DeleteObjectAsync(deleteRequest);

                _logger.LogInformation("File deleted successfully: {Filename}", filename);
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "S3 error deleting file {Filename}", filename);
                throw ApiErrorException.InternalServerError(
                    ErrorCodes.EXTERNAL_SERVICE_ERROR,
                    $"Failed to delete file: {ex.Message}");
            }
        }

        /// <summary>
        /// Downloads a file from storage
        /// </summary>
        public async Task<Stream> GetFileAsync(string bucketName, string key)
        {
            if (string.IsNullOrWhiteSpace(bucketName))
                throw new ArgumentException("Bucket name cannot be null or empty.", nameof(bucketName));

            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));

            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = key
                };

                var response = await _s3Client.GetObjectAsync(request);
                _logger.LogDebug("File retrieved successfully: {Key}", key);

                return response.ResponseStream;
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                _logger.LogWarning("File not found: {Key}", key);
                throw ApiErrorException.NotFound(
                    ErrorCodes.GENERAL_ERROR,
                    $"File not found: {key}");
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "S3 error getting file {Key}", key);
                throw ApiErrorException.InternalServerError(
                    ErrorCodes.EXTERNAL_SERVICE_ERROR,
                    $"Failed to get file: {ex.Message}");
            }
        }

        /// <summary>
        /// Checks if a file exists in storage
        /// </summary>
        public async Task<bool> FileExistsAsync(string bucketName, string key)
        {
            if (string.IsNullOrWhiteSpace(bucketName) || string.IsNullOrWhiteSpace(key))
                return false;

            try
            {
                var request = new GetObjectMetadataRequest
                {
                    BucketName = bucketName,
                    Key = key
                };

                await _s3Client.GetObjectMetadataAsync(request);
                return true;
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if file exists: {Key}", key);
                return false;
            }
        }

        /// <summary>
        /// Gets the public URL for a file
        /// </summary>
        public string GetFileUrl(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Key cannot be null or empty.", nameof(key));

            var cdnUrl = !string.IsNullOrWhiteSpace(_settings.Cdn) 
                ? _settings.Cdn 
                : _settings.Endpoint;

            return $"{cdnUrl}/{_settings.BucketName}/{key}";
        }

        #region Private Methods

        /// <summary>
        /// Uploads a base64 encoded image to storage
        /// </summary>
        private async Task<string> UploadBase64Image(
            string bucketName, 
            string cdnUrl, 
            string base64Data, 
            string folder, 
            CancellationToken token = default)
        {
            // Generate unique filename
            var extension = base64Data.GetFileExtension();
            var fileName = $"{Guid.NewGuid()}.{extension}";
            var fullKey = $"{folder}/{fileName}";

            // Clean base64 data
            var cleanData = base64Data.StripBase64Prefix();
            var bytes = Convert.FromBase64String(cleanData);

            // Get MIME type
            var contentType = MediaHelper.GetMimeType(extension);

            // Upload using TransferUtility for better performance
            using var transferUtility = new TransferUtility(_s3Client);
            await using var ms = new MemoryStream(bytes);

            var uploadRequest = new TransferUtilityUploadRequest
            {
                BucketName = bucketName,
                Key = fullKey,
                InputStream = ms,
                ContentType = contentType,
                CannedACL = S3CannedACL.PublicRead
            };

            await transferUtility.UploadAsync(uploadRequest, token);

            // Return full URL
            var baseUrl = !string.IsNullOrWhiteSpace(_settings.Cdn) 
                ? _settings.Cdn 
                : cdnUrl;

            return $"{baseUrl}/{bucketName}/{fullKey}";
        }

        #endregion
    }
}
