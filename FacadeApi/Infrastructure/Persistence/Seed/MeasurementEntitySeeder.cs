using Domain.Entities.Measurement;
using Infrastructure.Context;

namespace Infrastructure.Persistence.Seed
{
    /// <summary>
    /// Seeds initial MeasurementEntity data
    /// </summary>
    public class MeasurementEntitySeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.MeasurementEntities.Any())
                return;

            var entities = new List<MeasurementEntity>
            {
                new MeasurementEntity
                {
                    Id = 1,
                    Name = "Rider",
                    Description = "Measurements related to the rider/person",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new MeasurementEntity
                {
                    Id = 2,
                    Name = "Horse",
                    Description = "Measurements related to horses",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new MeasurementEntity
                {
                    Id = 3,
                    Name = "Product",
                    Description = "Measurements related to equestrian products",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.MeasurementEntities.AddRange(entities);
            context.SaveChanges();
        }
    }
}
