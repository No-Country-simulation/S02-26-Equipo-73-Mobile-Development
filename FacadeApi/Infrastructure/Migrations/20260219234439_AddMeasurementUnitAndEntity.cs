using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurementUnitAndEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntityType",
                table: "MeasurementTypes");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MeasurementTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<int>(
                name: "EntityTypeId",
                table: "MeasurementTypes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "MeasurementTypes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.CreateTable(
                name: "MeasurementEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserMeasurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    MeasurementTypeId = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    UnitId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMeasurements_MeasurementTypes_MeasurementTypeId",
                        column: x => x.MeasurementTypeId,
                        principalTable: "MeasurementTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserMeasurements_MeasurementUnits_UnitId",
                        column: x => x.UnitId,
                        principalTable: "MeasurementUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementTypes_EntityTypeId",
                table: "MeasurementTypes",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_MeasurementEntities_Name",
                table: "MeasurementEntities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserMeasurements_MeasurementTypeId",
                table: "UserMeasurements",
                column: "MeasurementTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMeasurements_UnitId",
                table: "UserMeasurements",
                column: "UnitId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMeasurements_UserId",
                table: "UserMeasurements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMeasurements_UserId_MeasurementTypeId",
                table: "UserMeasurements",
                columns: new[] { "UserId", "MeasurementTypeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MeasurementTypes_MeasurementEntities_EntityTypeId",
                table: "MeasurementTypes",
                column: "EntityTypeId",
                principalTable: "MeasurementEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeasurementTypes_MeasurementEntities_EntityTypeId",
                table: "MeasurementTypes");

            migrationBuilder.DropTable(
                name: "MeasurementEntities");

            migrationBuilder.DropTable(
                name: "UserMeasurements");

            migrationBuilder.DropIndex(
                name: "IX_MeasurementTypes_EntityTypeId",
                table: "MeasurementTypes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "MeasurementTypes");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "MeasurementTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "MeasurementTypes");

            migrationBuilder.AddColumn<string>(
                name: "EntityType",
                table: "MeasurementTypes",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
