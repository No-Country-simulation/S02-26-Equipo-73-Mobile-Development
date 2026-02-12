namespace Application.DTOs.Products
{
    /// <summary>
    /// DTO for product media response (GET)
    /// </summary>
    public class MediaProductDto
    {
        public int Id { get; set; }
        
        /// <summary>
        /// Public URL of the media file
        /// </summary>
        public string Url { get; set; }
        
        /// <summary>
        /// Type of media (image, video)
        /// </summary>
        public string MediaType { get; set; }
        
        /// <summary>
        /// Display order
        /// </summary>
        public int Order { get; set; }
        
        /// <summary>
        /// Whether this is the primary/main image
        /// </summary>
        public bool IsPrimary { get; set; }
    }
}
