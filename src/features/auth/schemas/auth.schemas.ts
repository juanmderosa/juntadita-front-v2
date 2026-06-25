import { z } from "zod";

export const emailOtpSchema = z.object({
  email: z.string().trim().email("Ingresa un email valido."),
});

export const otpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Ingresa el codigo que recibiste.")
    .max(12, "El codigo es demasiado largo."),
});

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(80, "El nombre no puede superar 80 caracteres."),
});

export type EmailOtpInput = z.infer<typeof emailOtpSchema>;
export type OtpCodeInput = z.infer<typeof otpCodeSchema>;
export type DisplayNameInput = z.infer<typeof displayNameSchema>;
