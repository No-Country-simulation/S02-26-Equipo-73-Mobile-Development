using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHorseEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Breeds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Breeds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disciplines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disciplines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HorseLevels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorseLevels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Horses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OwnerId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BirthDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Sex = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    BreedId = table.Column<int>(type: "integer", nullable: false),
                    DisciplineId = table.Column<int>(type: "integer", nullable: false),
                    LevelId = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Measurement_Id = table.Column<int>(type: "integer", nullable: true),
                    Measurement_WithersHeight = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_BackLength = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_ChestCircumference = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_WithersWidth = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_NeckLength = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_CannonCircumference = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_HeadLength = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Measurement_BackType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Measurement_WithersType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Measurement_ShoulderType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Horses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Horses_ApplicationUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "ApplicationUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Horses_Breeds_BreedId",
                        column: x => x.BreedId,
                        principalTable: "Breeds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Horses_Disciplines_DisciplineId",
                        column: x => x.DisciplineId,
                        principalTable: "Disciplines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Horses_HorseLevels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "HorseLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Breeds_Name",
                table: "Breeds",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Disciplines_Name",
                table: "Disciplines",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HorseLevels_Name",
                table: "HorseLevels",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Horses_BreedId",
                table: "Horses",
                column: "BreedId");

            migrationBuilder.CreateIndex(
                name: "IX_Horses_DisciplineId",
                table: "Horses",
                column: "DisciplineId");

            migrationBuilder.CreateIndex(
                name: "IX_Horses_IsActive",
                table: "Horses",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Horses_LevelId",
                table: "Horses",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Horses_OwnerId",
                table: "Horses",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Horses");

            migrationBuilder.DropTable(
                name: "Breeds");

            migrationBuilder.DropTable(
                name: "Disciplines");

            migrationBuilder.DropTable(
                name: "HorseLevels");
        }
    }
}
