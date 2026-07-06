import { z } from "zod";

export const apiFieldErrorSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
  errors: z.array(apiFieldErrorSchema).optional(),
});

export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    status: z.literal("success"),
    message: z.string().optional(),
    data: dataSchema,
  });

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    status: z.literal("success"),
    message: z.string().optional(),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
    }),
  });
