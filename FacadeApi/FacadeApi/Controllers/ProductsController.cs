using Application.Common;
using Application.DTOs.Common;
using Application.DTOs.Products;
using Application.Services.Products;
using Microsoft.AspNetCore.Mvc;

namespace FacadeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Obtiene todos los productos con filtros y paginación
        /// </summary>
        /// <param name="filter">Filtros para productos: marca, categoría, precio, talla, ordenamiento</param>
        /// <returns>Lista paginada de productos</returns>
        /// <response code="200">Productos obtenidos exitosamente</response>
        /// <response code="400">Parámetros de filtro inválidos</response>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<ProductDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.BadRequest("Invalid filter parameters", errors));
            }

            var result = await _productService.GetAllProductsAsync(filter);
            return Ok(ApiResponse<PagedResult<ProductDto>>.Ok(result, "Products retrieved successfully"));
        }

        /// <summary>
        /// Obtiene un producto por su ID
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <returns>Producto encontrado</returns>
        /// <response code="200">Producto encontrado</response>
        /// <response code="404">Producto no encontrado</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            return Ok(ApiResponse<ProductDto>.Ok(product, "Product retrieved successfully"));
        }

        /// <summary>
        /// Crea un nuevo producto
        /// </summary>
        /// <param name="createDto">Datos del producto a crear</param>
        /// <returns>Producto creado</returns>
        /// <response code="201">Producto creado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos</response>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateProductDto createDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.BadRequest("Invalid product data", errors));
            }

            var product = await _productService.CreateProductAsync(createDto);
            var response = ApiResponse<ProductDto>.Ok(product, "Product created successfully");

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
        }

        /// <summary>
        /// Actualiza un producto existente
        /// </summary>
        /// <param name="id">ID del producto a actualizar</param>
        /// <param name="updateDto">Datos actualizados del producto</param>
        /// <returns>Producto actualizado</returns>
        /// <response code="200">Producto actualizado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos</response>
        /// <response code="404">Producto no encontrado</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.BadRequest("Invalid product data", errors));
            }

            var product = await _productService.UpdateProductAsync(id, updateDto);

            if (product == null)
                return NotFound(ApiResponse<object>.NotFound($"Product with ID {id} not found"));

            return Ok(ApiResponse<ProductDto>.Ok(product, "Product updated successfully"));
        }

        /// <summary>
        /// Elimina un producto
        /// </summary>
        /// <param name="id">ID del producto a eliminar</param>
        /// <returns>Resultado de la operación</returns>
        /// <response code="200">Producto eliminado exitosamente</response>
        /// <response code="404">Producto no encontrado</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseNoData), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteProductAsync(id);
            return Ok(ApiResponseNoData.Ok("Product deleted successfully"));
        }
    }
}
