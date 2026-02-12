namespace Application.Interfaces
{
    /// <summary>
    /// Service for managing file storage operations (AWS S3, MinIO, etc.)
    /// </summary>
    public interface IStorageService
    {
        /// <summary>
        /// Uploads a file to storage
        /// </summary>
        /// <param name="key">File key/path in storage</param>
        /// <param name="fileStream">File content stream</param>
        /// <param name="contentType">MIME type of the file</param>
        Task UploadFileAsync(string key, Stream fileStream, string contentType);

        /// <summary>
        /// Processes an image URL or base64 string and uploads if necessary
        /// </summary>
        /// <param name="cdnUrl">CDN base URL</param>
        /// <param name="imageUrl">Image URL or base64 string</param>
        /// <param name="folder">Target folder in storage</param>
        /// <returns>Final URL of the processed image</returns>
        Task<string> ProcessImageUrl(string cdnUrl, string imageUrl, string folder);

        /// <summary>
        /// Processes an image base64 string and uploads it (simplified version)
        /// </summary>
        /// <param name="imageData">Base64 image data or URL</param>
        /// <param name="folder">Target folder in storage</param>
        /// <returns>Public URL of the uploaded image</returns>
        Task<string> ProcessImageUrlAsync(string imageData, string folder);

        /// <summary>
        /// Deletes a file from storage
        /// </summary>
        /// <param name="bucketName">Bucket name</param>
        /// <param name="filename">File key/path</param>
        Task DeleteFileAsync(string bucketName, string filename);

        /// <summary>
        /// Downloads a file from storage
        /// </summary>
        /// <param name="bucketName">Bucket name</param>
        /// <param name="key">File key/path</param>
        /// <returns>Stream with file content</returns>
        Task<Stream> GetFileAsync(string bucketName, string key);

        /// <summary>
        /// Checks if a file exists in storage
        /// </summary>
        /// <param name="bucketName">Bucket name</param>
        /// <param name="key">File key/path</param>
        /// <returns>True if exists, false otherwise</returns>
        Task<bool> FileExistsAsync(string bucketName, string key);

        /// <summary>
        /// Gets the public URL for a file
        /// </summary>
        /// <param name="key">File key/path</param>
        /// <returns>Public URL</returns>
        string GetFileUrl(string key);
    }
}
