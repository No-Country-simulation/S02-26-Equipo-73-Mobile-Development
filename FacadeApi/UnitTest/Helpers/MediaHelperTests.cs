using Application.Helpers;
using FluentAssertions;
using Xunit;

namespace UnitTest.Helpers
{
    public class MediaHelperTests
    {
        #region ValidateImageFormat Tests

        [Fact]
        public void ValidateImageFormat_WithValidJpeg_ReturnsTrue()
        {
            // Arrange
            var base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateImageFormat_WithValidPng_ReturnsTrue()
        {
            // Arrange
            var base64Image = "data:image/png;base64,iVBORw0KGgo=";

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateImageFormat_WithValidWebp_ReturnsTrue()
        {
            // Arrange
            var base64Image = "data:image/webp;base64,UklGR===";

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateImageFormat_WithInvalidFormat_ReturnsFalse()
        {
            // Arrange
            var base64Image = "data:image/invalid;base64,abc123";

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void ValidateImageFormat_WithNull_ReturnsFalse()
        {
            // Arrange
            string base64Image = null;

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void ValidateImageFormat_WithEmpty_ReturnsFalse()
        {
            // Arrange
            var base64Image = string.Empty;

            // Act
            var result = base64Image.ValidateImageFormat();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void ValidateImageFormat_WithUrl_ReturnsTrue()
        {
            // Arrange
            var url = "https://example.com/image.jpg";

            // Act
            var result = url.ValidateImageFormat();

            // Assert
            result.Should().BeTrue();
        }

        #endregion

        #region ValidateVideoFormat Tests

        [Fact]
        public void ValidateVideoFormat_WithValidMp4_ReturnsTrue()
        {
            // Arrange
            var base64Video = "data:video/mp4;base64,AAAAIGZ0eXA=";

            // Act
            var result = base64Video.ValidateVideoFormat();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateVideoFormat_WithInvalidFormat_ReturnsFalse()
        {
            // Arrange
            var base64Video = "data:video/invalid;base64,abc123";

            // Act
            var result = base64Video.ValidateVideoFormat();

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region GetFileExtension Tests

        [Fact]
        public void GetFileExtension_WithJpeg_ReturnsJpeg()
        {
            // Arrange
            var base64Image = "data:image/jpeg;base64,/9j/4AAQ";

            // Act
            var result = base64Image.GetFileExtension();

            // Assert
            result.Should().Be("jpeg");
        }

        [Fact]
        public void GetFileExtension_WithPng_ReturnsPng()
        {
            // Arrange
            var base64Image = "data:image/png;base64,iVBORw0";

            // Act
            var result = base64Image.GetFileExtension();

            // Assert
            result.Should().Be("png");
        }

        [Fact]
        public void GetFileExtension_WithUrl_ReturnsExtension()
        {
            // Arrange
            var url = "https://example.com/image.jpg";

            // Act
            var result = url.GetFileExtension();

            // Assert
            result.Should().Be("jpg");
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void GetFileExtension_WithNullOrEmpty_ThrowsArgumentException(string input)
        {
            // Act
            Action act = () => input.GetFileExtension();

            // Assert
            act.Should().Throw<ArgumentException>();
        }

        #endregion

        #region IsUrl Tests

        [Theory]
        [InlineData("https://example.com/image.jpg")]
        [InlineData("http://example.com/image.png")]
        [InlineData("https://cdn.example.com/folder/image.webp")]
        public void IsUrl_WithValidUrl_ReturnsTrue(string url)
        {
            // Act
            var result = url.IsUrl();

            // Assert
            result.Should().BeTrue();
        }

        [Theory]
        [InlineData("data:image/jpeg;base64,/9j/4AAQ")]
        [InlineData("not-a-url")]
        [InlineData("ftp://example.com/file.txt")]
        [InlineData(null)]
        [InlineData("")]
        public void IsUrl_WithInvalidUrl_ReturnsFalse(string input)
        {
            // Act
            var result = input.IsUrl();

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region IsBase64Image Tests

        [Fact]
        public void IsBase64Image_WithValidBase64_ReturnsTrue()
        {
            // Arrange
            var base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

            // Act
            var result = base64Image.IsBase64Image();

            // Assert
            result.Should().BeTrue();
        }

        [Theory]
        [InlineData("https://example.com/image.jpg")]
        [InlineData("not-base64")]
        [InlineData(null)]
        [InlineData("")]
        public void IsBase64Image_WithInvalidInput_ReturnsFalse(string input)
        {
            // Act
            var result = input.IsBase64Image();

            // Assert
            result.Should().BeFalse();
        }

        #endregion

        #region StripBase64Prefix Tests

        [Fact]
        public void StripBase64Prefix_WithPrefix_RemovesPrefix()
        {
            // Arrange
            var base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
            var expectedResult = "/9j/4AAQSkZJRg==";

            // Act
            var result = base64Image.StripBase64Prefix();

            // Assert
            result.Should().Be(expectedResult);
        }

        [Fact]
        public void StripBase64Prefix_WithoutPrefix_ReturnsSame()
        {
            // Arrange
            var base64Data = "/9j/4AAQSkZJRg==";

            // Act
            var result = base64Data.StripBase64Prefix();

            // Assert
            result.Should().Be(base64Data);
        }

        #endregion

        #region GetMimeType Tests

        [Theory]
        [InlineData("jpg", "image/jpeg")]
        [InlineData("jpeg", "image/jpeg")]
        [InlineData("png", "image/png")]
        [InlineData("gif", "image/gif")]
        [InlineData("webp", "image/webp")]
        [InlineData("svg", "image/svg+xml")]
        [InlineData("mp4", "video/mp4")]
        [InlineData("unknown", "application/octet-stream")]
        public void GetMimeType_WithExtension_ReturnsCorrectMimeType(string extension, string expectedMimeType)
        {
            // Act
            var result = MediaHelper.GetMimeType(extension);

            // Assert
            result.Should().Be(expectedMimeType);
        }

        [Fact]
        public void GetMimeType_WithDotPrefix_RemovesDot()
        {
            // Act
            var result = MediaHelper.GetMimeType(".jpg");

            // Assert
            result.Should().Be("image/jpeg");
        }

        #endregion

        #region ValidateFileSize Tests

        [Fact]
        public void ValidateFileSize_WithSmallFile_ReturnsTrue()
        {
            // Arrange - Create a small base64 image (< 1MB)
            var smallBase64 = "data:image/jpeg;base64," + Convert.ToBase64String(new byte[1024]); // 1KB

            // Act
            var result = smallBase64.ValidateFileSize(10);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateFileSize_WithLargeFile_ReturnsFalse()
        {
            // Arrange - Create a large base64 image (> 10MB)
            var largeBase64 = "data:image/jpeg;base64," + Convert.ToBase64String(new byte[11 * 1024 * 1024]); // 11MB

            // Act
            var result = largeBase64.ValidateFileSize(10);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void ValidateFileSize_WithUrl_ReturnsTrue()
        {
            // Arrange
            var url = "https://example.com/image.jpg";

            // Act
            var result = url.ValidateFileSize(10);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ValidateFileSize_WithNull_ReturnsTrue()
        {
            // Arrange
            string input = null;

            // Act
            var result = input.ValidateFileSize(10);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}
