using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    EntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementUnits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Symbol = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    ToBaseFactor = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementUnits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SizeSystems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SizeSystems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BrandSizes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BrandId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    SizeSystemId = table.Column<int>(type: "integer", nullable: false),
                    Label = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrandSizes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BrandSizes_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BrandSizes_ProductCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "ProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BrandSizes_SizeSystems_SizeSystemId",
                        column: x => x.SizeSystemId,
                        principalTable: "SizeSystems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BrandSizeMeasurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BrandSizeId = table.Column<int>(type: "integer", nullable: false),
                    MeasurementTypeId = table.Column<int>(type: "integer", nullable: false),
                    MinValue = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    MaxValue = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    UnitId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrandSizeMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BrandSizeMeasurements_BrandSizes_BrandSizeId",
                        column: x => x.BrandSizeId,
                        principalTable: "BrandSizes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BrandSizeMeasurements_MeasurementTypes_MeasurementTypeId",
                        column: x => x.MeasurementTypeId,
                        principalTable: "MeasurementTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BrandSizeMeasurements_MeasurementUnits_UnitId",
                        column: x => x.UnitId,
                        principalTable: "MeasurementUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Brands_Name",
                table: "Brands",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizeMeasurements_BrandSizeId",
                table: "BrandSizeMeasurements",
                column: "BrandSizeId");

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizeMeasurements_MeasurementTypeId_UnitId",
                table: "BrandSizeMeasurements",
                columns: new[] { "MeasurementTypeId", "UnitId" });

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizeMeasurements_UnitId",
                table: "BrandSizeMeasurements",
                column: "UnitId");

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizes_BrandId_CategoryId_SizeSystemId_Label",
                table: "BrandSizes",
                columns: new[] { "BrandId", "CategoryId", "SizeSystemId", "Label" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizes_CategoryId",
                table: "BrandSizes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BrandSizes_SizeSystemId",
                table: "BrandSizes",
                column: "SizeSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementTypes_Name",
                table: "MeasurementTypes",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementUnits_Name",
                table: "MeasurementUnits",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementUnits_Symbol",
                table: "MeasurementUnits",
                column: "Symbol",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategories_Name",
                table: "ProductCategories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SizeSystems_Name",
                table: "SizeSystems",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BrandSizeMeasurements");

            migrationBuilder.DropTable(
                name: "BrandSizes");

            migrationBuilder.DropTable(
                name: "MeasurementTypes");

            migrationBuilder.DropTable(
                name: "MeasurementUnits");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropTable(
                name: "ProductCategories");

            migrationBuilder.DropTable(
                name: "SizeSystems");
        }
    }
}
