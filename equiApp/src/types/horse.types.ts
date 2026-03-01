/**
 * Types related to horses and their management
 */

// Enums matching backend
export enum SexType {
    Male = 1,
    Female = 2,
}

export enum BackType {
    Straight = 0,
    Concave = 1,
    Convex = 2,
    Other = 3,
}

export enum WithersType {
    Prominent = 0,
    Medium = 1,
    Flat = 2,
    Other = 3,
}

export enum ShoulderType {
    Inclined = 0,
    Straight = 1,
    Other = 2,
}

// Reference data interfaces
export interface Breed {
    id: number;
    name: string;
}

export interface Discipline {
    id: number;
    name: string;
}

export interface Level {
    id: number;
    name: string;
}

export interface HorseReference {
    breeds: Breed[];
    disciplines: Discipline[];
    levels: Level[];
}

// Horse measurement interface
export interface HorseMeasurement {
    id?: number;
    withersHeight?: number | null;
    backLength?: number | null;
    chestCircumference?: number | null;
    withersWidth?: number | null;
    neckLength?: number | null;
    cannonCircumference?: number | null;
    headLength?: number | null;
    backType?: string | null;
    withersType?: string | null;
    shoulderType?: string | null;
}

// Horse interface
export interface Horse {
    id: number;
    ownerId: number;
    name: string;
    birthDate: string;
    sex: string;
    breedId: number;
    breedName: string;
    disciplineId: number;
    disciplineName: string;
    levelId: number;
    levelName: string;
    isActive: boolean;
    measurement: HorseMeasurement;
    createdAt: string;
    updatedAt: string;
}

// DTOs for create/update
export interface CreateHorseDto {
    name: string;
    birthDate: string;
    sex: SexType;
    breedId: number;
    disciplineId: number;
    levelId: number;
    measurement?: HorseMeasurement;
}

export interface UpdateHorseDto {
    name?: string;
    birthDate?: string;
    sex?: SexType;
    breedId?: number;
    disciplineId?: number;
    levelId?: number;
    isActive?: boolean;
    measurement?: HorseMeasurement;
}

// Helper functions
export const getSexLabel = (sex: string | SexType): string => {
    if (typeof sex === 'string') {
        return sex;
    }
    return sex === SexType.Male ? 'Male' : 'Female';
};

export const getBackTypeLabel = (type: string | null | undefined): string => {
    if (type === null || type === undefined) return 'Not specified';

    if (type in BackType) {
        return type;
    }
    return 'Unknown';
};

export const getWithersTypeLabel = (type: string | null | undefined): string => {
    if (type === null || type === undefined) return 'Not specified';

    if (type in WithersType) {
        return type;
    }
    return 'Unknown';
};

export const getShoulderTypeLabel = (type: string | null | undefined): string => {
    if (type === null || type === undefined) return 'Not specified';

    if (type in ShoulderType) {
        return type;
    }
    return 'Unknown';
};
