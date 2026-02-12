namespace Application.DTOs.Products
{
    /// <summary>
    /// DTO for creating/updating product media (POST/PUT)
    /// Can be either a base64 string (new image) or a URL (existing image)
    /// </summary>
    public class MediaProductInputDto
    {
        /// <summary>
        /// Base64 string for NEW image OR URL for EXISTING image
        /// If it's a URL, the image won't be updated
        /// </summary>
        public string Value { get; set; }
        
        /// <summary>
        /// Type of media (image, video)
        /// </summary>
        public string MediaType { get; set; } = "image";
        
        /// <summary>
        /// Display order
        /// </summary>
        public int Order { get; set; }
        
        /// <summary>
        /// Whether this is the primary/main image
        /// </summary>
        public bool IsPrimary { get; set; }
        
        /// <summary>
        /// ID for updates (optional, used in PUT operations)
        /// </summary>
        public int? Id { get; set; }
    }
}
