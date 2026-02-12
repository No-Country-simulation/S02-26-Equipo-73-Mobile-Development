using Amazon.S3;
using Amazon.S3.Model;
using Application.Common.Errors;
using FluentAssertions;
using Infrastructure.AWS.S3;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Net;
using Xunit;

namespace UnitTest.Services
{
    public class StorageServiceTests
    {
        private readonly Mock<IAmazonS3> _mockS3Client;
        private readonly Mock<ILogger<StorageService>> _mockLogger;
        private readonly IOptions<StorageSettings> _storageSettings;
        private readonly StorageService _service;

        public StorageServiceTests()
        {
            _mockS3Client = new Mock<IAmazonS3>();
            _mockLogger = new Mock<ILogger<StorageService>>();

            _storageSettings = Options.Create(new StorageSettings
            {
                BucketName = "test-bucket",
                AccessKey = "test-key",
                SecretKey = "test-secret",
                Endpoint = "https://s3.example.com",
                Cdn = "https://cdn.example.com",
                UseSsl = true,
                UseMinio = false
            });

            _service = new StorageService(_mockS3Client.Object, _storageSettings, _mockLogger.Object);
        }

        #region UploadFileAsync Tests

        [Fact]
        public async Task UploadFileAsync_WithValidData_UploadsSuccessfully()
        {
            // Arrange
            var key = "test/image.jpg";
            var contentType = "image/jpeg";
            using var stream = new MemoryStream(new byte[] { 1, 2, 3 });

            _mockS3Client
                .Setup(s => s.PutObjectAsync(It.IsAny<PutObjectRequest>(), default))
                .ReturnsAsync(new PutObjectResponse { HttpStatusCode = HttpStatusCode.OK });

            // Act
            await _service.UploadFileAsync(key, stream, contentType);

            // Assert
            _mockS3Client.Verify(s => s.PutObjectAsync(
                It.Is<PutObjectRequest>(r =>
                    r.BucketName == "test-bucket" &&
                    r.Key == key &&
                    r.ContentType == contentType),
                default), Times.Once);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task UploadFileAsync_WithInvalidKey_ThrowsArgumentException(string key)
        {
            // Arrange
            using var stream = new MemoryStream();

            // Act
            Func<Task> act = async () => await _service.UploadFileAsync(key, stream, "image/jpeg");

            // Assert
            await act.Should().ThrowAsync<ArgumentException>();
        }

        [Fact]
        public async Task UploadFileAsync_WithNullStream_ThrowsArgumentNullException()
        {
            // Act
            Func<Task> act = async () => await _service.UploadFileAsync("test.jpg", null, "image/jpeg");

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>();
        }

        [Fact]
        public async Task UploadFileAsync_WhenS3Fails_ThrowsApiErrorException()
        {
            // Arrange
            var key = "test/image.jpg";
            using var stream = new MemoryStream(new byte[] { 1, 2, 3 });

            _mockS3Client
                .Setup(s => s.PutObjectAsync(It.IsAny<PutObjectRequest>(), default))
                .ReturnsAsync(new PutObjectResponse { HttpStatusCode = HttpStatusCode.InternalServerError });

            // Act
            Func<Task> act = async () => await _service.UploadFileAsync(key, stream, "image/jpeg");

            // Assert
            await act.Should().ThrowAsync<ApiErrorException>()
                .Where(e => e.ErrorResponse.ErrorCode == ErrorCodes.EXTERNAL_SERVICE_ERROR);
        }

        #endregion

        #region ProcessImageUrlAsync Tests

        [Fact]
        public async Task ProcessImageUrlAsync_WithUrl_ReturnsUrl()
        {
            // Arrange
            var imageUrl = "https://example.com/image.jpg";

            // Act
            var result = await _service.ProcessImageUrlAsync(imageUrl, "products");

            // Assert
            result.Should().Be(imageUrl);
            _mockS3Client.Verify(s => s.PutObjectAsync(It.IsAny<PutObjectRequest>(), default), Times.Never);
        }

        [Fact]
        public async Task ProcessImageUrlAsync_WithNullOrEmpty_ReturnsNull()
        {
            // Act
            var result = await _service.ProcessImageUrlAsync(null, "products");

            // Assert
            result.Should().BeNull();
        }

        #endregion

        #region DeleteFileAsync Tests

        [Fact]
        public async Task DeleteFileAsync_WithValidFile_DeletesSuccessfully()
        {
            // Arrange
            var bucketName = "test-bucket";
            var filename = "test/image.jpg";

            _mockS3Client
                .Setup(s => s.DeleteObjectAsync(It.IsAny<DeleteObjectRequest>(), default))
                .ReturnsAsync(new DeleteObjectResponse());

            // Act
            await _service.DeleteFileAsync(bucketName, filename);

            // Assert
            _mockS3Client.Verify(s => s.DeleteObjectAsync(
                It.Is<DeleteObjectRequest>(r =>
                    r.BucketName == bucketName &&
                    r.Key == filename),
                default), Times.Once);
        }

        [Theory]
        [InlineData(null, "file.jpg")]
        [InlineData("", "file.jpg")]
        [InlineData("bucket", null)]
        [InlineData("bucket", "")]
        public async Task DeleteFileAsync_WithInvalidParams_ThrowsArgumentException(string bucketName, string filename)
        {
            // Act
            Func<Task> act = async () => await _service.DeleteFileAsync(bucketName, filename);

            // Assert
            await act.Should().ThrowAsync<ArgumentException>();
        }

        #endregion

        #region GetFileAsync Tests

        [Fact]
        public async Task GetFileAsync_WithExistingFile_ReturnsStream()
        {
            // Arrange
            var bucketName = "test-bucket";
            var key = "test/image.jpg";
            var mockStream = new MemoryStream(new byte[] { 1, 2, 3 });

            _mockS3Client
                .Setup(s => s.GetObjectAsync(It.IsAny<GetObjectRequest>(), default))
                .ReturnsAsync(new GetObjectResponse
                {
                    ResponseStream = mockStream,
                    HttpStatusCode = HttpStatusCode.OK
                });

            // Act
            var result = await _service.GetFileAsync(bucketName, key);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeSameAs(mockStream);
        }

        [Fact]
        public async Task GetFileAsync_WithNonExistingFile_ThrowsNotFoundException()
        {
            // Arrange
            var bucketName = "test-bucket";
            var key = "non-existing.jpg";

            _mockS3Client
                .Setup(s => s.GetObjectAsync(It.IsAny<GetObjectRequest>(), default))
                .ThrowsAsync(new AmazonS3Exception("Not found")
                {
                    StatusCode = HttpStatusCode.NotFound
                });

            // Act
            Func<Task> act = async () => await _service.GetFileAsync(bucketName, key);

            // Assert
            await act.Should().ThrowAsync<ApiErrorException>()
                .Where(e => e.ErrorResponse.ErrorCode == ErrorCodes.GENERAL_ERROR);
        }

        #endregion

        #region FileExistsAsync Tests

        [Fact]
        public async Task FileExistsAsync_WithExistingFile_ReturnsTrue()
        {
            // Arrange
            var bucketName = "test-bucket";
            var key = "test/image.jpg";

            _mockS3Client
                .Setup(s => s.GetObjectMetadataAsync(It.IsAny<GetObjectMetadataRequest>(), default))
                .ReturnsAsync(new GetObjectMetadataResponse
                {
                    HttpStatusCode = HttpStatusCode.OK
                });

            // Act
            var result = await _service.FileExistsAsync(bucketName, key);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task FileExistsAsync_WithNonExistingFile_ReturnsFalse()
        {
            // Arrange
            var bucketName = "test-bucket";
            var key = "non-existing.jpg";

            _mockS3Client
                .Setup(s => s.GetObjectMetadataAsync(It.IsAny<GetObjectMetadataRequest>(), default))
                .ThrowsAsync(new AmazonS3Exception("Not found")
                {
                    StatusCode = HttpStatusCode.NotFound
                });

            // Act
            var result = await _service.FileExistsAsync(bucketName, key);

            // Assert
            result.Should().BeFalse();
        }

        [Theory]
        [InlineData(null, "file.jpg")]
        [InlineData("", "file.jpg")]
        [InlineData("bucket", null)]
        [InlineData("bucket", "")]
        public async Task FileExistsAsync_WithInvalidParams_ReturnsFalse(string bucketName, string key)
        {
            // Act
            var result = await _service.FileExistsAsync(bucketName, key);

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region GetFileUrl Tests

        [Fact]
        public void GetFileUrl_WithValidKey_ReturnsUrl()
        {
            // Arrange
            var key = "products/image.jpg";

            // Act
            var result = _service.GetFileUrl(key);

            // Assert
            result.Should().Be("https://cdn.example.com/test-bucket/products/image.jpg");
        }

        [Fact]
        public void GetFileUrl_WithNullKey_ThrowsArgumentException()
        {
            // Act
            Action act = () => _service.GetFileUrl(null);

            // Assert
            act.Should().Throw<ArgumentException>();
        }

        [Fact]
        public void GetFileUrl_WithoutCdn_UsesEndpoint()
        {
            // Arrange
            var settingsWithoutCdn = Options.Create(new StorageSettings
            {
                BucketName = "test-bucket",
                Endpoint = "https://s3.example.com",
                Cdn = null
            });

            var service = new StorageService(_mockS3Client.Object, settingsWithoutCdn, _mockLogger.Object);
            var key = "products/image.jpg";

            // Act
            var result = service.GetFileUrl(key);

            // Assert
            result.Should().Be("https://s3.example.com/test-bucket/products/image.jpg");
        }

        #endregion
    }
}
