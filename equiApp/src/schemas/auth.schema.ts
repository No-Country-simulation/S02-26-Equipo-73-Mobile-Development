import { z } from 'zod';

/**
 * Mensajes de error personalizados en español
 */
const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  passwordMatch: 'Las contraseñas no coinciden',
  passwordStrength: 'La contraseña debe tener al menos 6 caracteres',
};

/**
 * Schema para inicio de sesión
 */
export const loginSchema = z.object({
  email: z
    .string({ error: errorMessages.required })
    .email({ message: errorMessages.email })
    .trim()
    .toLowerCase(),
  password: z
    .string({ message: errorMessages.required })
    .min(6, { message: errorMessages.passwordStrength }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema para registro
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: errorMessages.minLength(2) })
      .max(100, { message: errorMessages.maxLength(100) })
      .optional(),
    email: z
      .string({ message: errorMessages.required })
      .email({ message: errorMessages.email })
      .trim()
      .toLowerCase(),
    password: z
      .string({ message: errorMessages.required })
      .min(6, { message: errorMessages.passwordStrength }),
    confirmPassword: z
      .string({ message: errorMessages.required })
      .min(6, { message: errorMessages.passwordStrength }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordMatch,
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schema para recuperación de contraseña
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: errorMessages.required })
    .email({ message: errorMessages.email })
    .trim()
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema para resetear contraseña
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: errorMessages.required })
      .min(6, { message: errorMessages.passwordStrength }),
    confirmPassword: z
      .string({ message: errorMessages.required })
      .min(6, { message: errorMessages.passwordStrength }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordMatch,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Schema para actualizar perfil
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: errorMessages.minLength(2) })
    .max(100, { message: errorMessages.maxLength(100) })
    .optional(),
  firstName: z
    .string()
    .min(2, { message: errorMessages.minLength(2) })
    .max(50, { message: errorMessages.maxLength(50) })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: errorMessages.minLength(2) })
    .max(50, { message: errorMessages.maxLength(50) })
    .optional(),
  phone: z
    .string()
    .min(8, { message: 'Teléfono inválido' })
    .max(15, { message: 'Teléfono inválido' })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
