/**
 * Tipos relacionados con mediciones (Measurements)
 */

// Tipos de entidades que pueden tener medidas
export interface MeasurementType {
  id: number;
  name: string;
}

export interface EntityType {
  id: number;
  name: string;
  description: string | null;
  measurementTypes: MeasurementType[];
}

// Unidades de medida
export interface Unit {
  id: number;
  name: string;
  symbol: string;
}

// Referencia de mediciones (GET /api/Measurement/reference)
export interface MeasurementReference {
  entityTypes: EntityType[];
  units: Unit[];
}

// Medición de un usuario o entidad
export interface Measurement {
  id: number;
  userId: number;
  measurementTypeId: number;
  measurementTypeName: string;
  entityTypeName: string;
  value: number;
  unitId: number;
  unitName: string;
  unitSymbol: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs para crear/actualizar mediciones
export interface CreateMeasurementDto {
  measurementTypeId: number;
  value: number;
  unitId: number;
}

export interface UpdateMeasurementDto {
  value?: number;
  unitId?: number;
}
