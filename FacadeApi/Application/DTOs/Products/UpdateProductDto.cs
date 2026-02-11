using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Products
{
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
    }
}
