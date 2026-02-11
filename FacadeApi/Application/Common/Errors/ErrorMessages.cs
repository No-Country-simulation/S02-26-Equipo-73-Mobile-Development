namespace Application.Common.Errors
{
    /// <summary>
    /// Mensajes de error estandarizados en español
    /// </summary>
    public static class ErrorMessages
    {
        private static readonly Dictionary<string, string> Messages = new()
        {
            // General Errors
            { ErrorCodes.GENERAL_ERROR, "Ha ocurrido un error inesperado" },
            { ErrorCodes.INTERNAL_SERVER_ERROR, "Error interno del servidor" },
            { ErrorCodes.VALIDATION_ERROR, "Error de validación en los datos proporcionados" },
            { ErrorCodes.UNAUTHORIZED, "No autorizado para realizar esta acción" },
            { ErrorCodes.FORBIDDEN, "Acceso prohibido al recurso solicitado" },
            { ErrorCodes.BAD_REQUEST, "La solicitud contiene datos inválidos" },

            // Product Errors
            { ErrorCodes.PRODUCT_NOT_FOUND, "Producto no encontrado" },
            { ErrorCodes.PRODUCT_ALREADY_EXISTS, "El producto ya existe" },
            { ErrorCodes.PRODUCT_INVALID_PRICE, "El precio del producto es inválido" },
            { ErrorCodes.PRODUCT_INVALID_NAME, "El nombre del producto es inválido" },
            { ErrorCodes.PRODUCT_CREATE_FAILED, "No se pudo crear el producto" },
            { ErrorCodes.PRODUCT_UPDATE_FAILED, "No se pudo actualizar el producto" },
            { ErrorCodes.PRODUCT_DELETE_FAILED, "No se pudo eliminar el producto" },

            // Brand Errors
            { ErrorCodes.BRAND_NOT_FOUND, "Marca no encontrada" },
            { ErrorCodes.BRAND_ALREADY_EXISTS, "La marca ya existe" },

            // Category Errors
            { ErrorCodes.CATEGORY_NOT_FOUND, "Categoría no encontrada" },
            { ErrorCodes.CATEGORY_ALREADY_EXISTS, "La categoría ya existe" },

            // Size Errors
            { ErrorCodes.SIZE_NOT_FOUND, "Talla no encontrada" },
            { ErrorCodes.SIZE_INVALID, "Talla inválida" },

            // Database Errors
            { ErrorCodes.DATABASE_ERROR, "Error en la base de datos" },
            { ErrorCodes.DATABASE_CONNECTION_FAILED, "No se pudo conectar a la base de datos" },
            { ErrorCodes.DATABASE_CONSTRAINT_VIOLATION, "Violación de restricción de base de datos" },

            // External Service Errors
            { ErrorCodes.EXTERNAL_SERVICE_ERROR, "Error en servicio externo" },
            { ErrorCodes.EXTERNAL_API_UNAVAILABLE, "API externa no disponible" }
        };

        public static string Get(string errorCode)
        {
            return Messages.TryGetValue(errorCode, out var message) 
                ? message 
                : "Error desconocido";
        }

        public static string Get(string errorCode, params object[] args)
        {
            var message = Get(errorCode);
            return string.Format(message, args);
        }
    }
}
