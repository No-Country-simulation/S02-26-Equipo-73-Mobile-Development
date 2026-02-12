namespace Application.Common.Errors
{
    /// <summary>
    /// Códigos de error estandarizados para la aplicación
    /// </summary>
    public static class ErrorCodes
    {
        // General Errors (1000-1099)
        public const string GENERAL_ERROR = "ERR_1000";
        public const string INTERNAL_SERVER_ERROR = "ERR_1001";
        public const string VALIDATION_ERROR = "ERR_1002";
        public const string UNAUTHORIZED = "ERR_1003";
        public const string FORBIDDEN = "ERR_1004";
        public const string BAD_REQUEST = "ERR_1005";

        // Product Errors (2000-2099)
        public const string PRODUCT_NOT_FOUND = "ERR_2000";
        public const string PRODUCT_ALREADY_EXISTS = "ERR_2001";
        public const string PRODUCT_INVALID_PRICE = "ERR_2002";
        public const string PRODUCT_INVALID_NAME = "ERR_2003";
        public const string PRODUCT_CREATE_FAILED = "ERR_2004";
        public const string PRODUCT_UPDATE_FAILED = "ERR_2005";
        public const string PRODUCT_DELETE_FAILED = "ERR_2006";

        // Brand Errors (2100-2199)
        public const string BRAND_NOT_FOUND = "ERR_2100";
        public const string BRAND_ALREADY_EXISTS = "ERR_2101";

        // Category Errors (2200-2299)
        public const string CATEGORY_NOT_FOUND = "ERR_2200";
        public const string CATEGORY_ALREADY_EXISTS = "ERR_2201";

        // Size Errors (2300-2399)
        public const string SIZE_NOT_FOUND = "ERR_2300";
        public const string SIZE_INVALID = "ERR_2301";

        // Database Errors (3000-3099)
        public const string DATABASE_ERROR = "ERR_3000";
        public const string DATABASE_CONNECTION_FAILED = "ERR_3001";
        public const string DATABASE_CONSTRAINT_VIOLATION = "ERR_3002";

        // External Service Errors (4000-4099)
        public const string EXTERNAL_SERVICE_ERROR = "ERR_4000";
        public const string EXTERNAL_API_UNAVAILABLE = "ERR_4001";
    }
}
