namespace Infrastructure.AWS.S3
{
    public class StorageSettings
    {
        public string Service { get; set; }
        public string BucketName { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string Endpoint { get; set; }
        public string Cdn { get; set; }
        public bool UseSsl { get; set; }
        public bool UseMinio { get; set; } = false;
    }
}
