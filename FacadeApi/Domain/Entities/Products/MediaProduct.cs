namespace Domain.Entities.Products
{
    /// <summary>
    /// Represents media files (images, videos) associated with a product
    /// </summary>
    public class MediaProduct
    {
        public int Id { get; set; }

        /// <summary>
        /// URL of the media file in storage (S3/MinIO)
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// Type of media (e.g., "image", "video")
        /// </summary>
        public string MediaType { get; set; } = "image";

        /// <summary>
        /// Display order for sorting images
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// Whether this is the main/primary image
        /// </summary>
        public bool IsPrimary { get; set; }

        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}
