namespace Domain.Entities.Products
{
    /// <summary>
    /// Especificación libre de un producto (Discipline: Dressage, Closure: Lace-up, etc.)
    /// </summary>
    public class ProductSpecification
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public virtual Product Product { get; set; }

        /// <summary>
        /// Nombre de la especificación (ej: "Discipline", "Closure", "Waterproof")
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// Valor de la especificación (ej: "Dressage", "Lace-up", "Yes")
        /// </summary>
        public string Value { get; set; }
    }
}
