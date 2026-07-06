import { z } from "zod";
import { successResponseSchema } from "./api.schemas";
import {
  isoDateTimeSchema,
  normalizedEmailSchema,
  uuidSchema,
} from "./common.schemas";

const profileSchema = z.object({
  id: uuidSchema,
  email: normalizedEmailSchema,
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  onboardingCompletedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const currentUserResponseSchema = successResponseSchema(
  z.object({
    user: z.object({
      id: uuidSchema,
      email: normalizedEmailSchema.nullable(),
    }),
    profile: profileSchema,
    requiresProfileOnboarding: z.boolean(),
  }),
);
