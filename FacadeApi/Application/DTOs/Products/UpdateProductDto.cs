using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Products
{
    /// <summary>
    /// DTO for updating a product (PUT)
    /// </summary>
    public class UpdateProductDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "BrandId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "BrandId must be greater than 0")]
        public int BrandId { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0")]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; }

        /// <summary>
        /// Product images/media
        /// - Base64 string = new image (will be uploaded)
        /// - URL = existing image (won't be updated)
        /// - Images not in the list will be deleted
        /// </summary>
        public List<MediaProductInputDto> Media { get; set; } = new();
    }
}
