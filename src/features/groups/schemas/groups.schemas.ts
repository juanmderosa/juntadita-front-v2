import { z } from "zod";
import { successResponseSchema } from "@/schemas/api.schemas";
import { isoDateTimeSchema, uuidSchema } from "@/schemas/common.schemas";

export const contactGroupMemberSchema = z.object({
  id: uuidSchema,
  groupId: uuidSchema,
  email: z.email(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const contactGroupSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  memberCount: z.number().int().nonnegative(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const createGroupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Indicá un nombre para el grupo.")
    .max(120, "El nombre no puede superar 120 caracteres."),
});

export const addGroupContactsFormSchema = z.object({
  emailsText: z.string(),
});

export const contactGroupDetailSchema = contactGroupSchema.extend({
  members: z.array(contactGroupMemberSchema),
});

export const groupsResponseSchema = successResponseSchema(z.array(contactGroupSchema));
export const groupResponseSchema = successResponseSchema(contactGroupDetailSchema);

export type CreateGroupFormInput = z.infer<typeof createGroupFormSchema>;
export type AddGroupContactsFormInput = z.infer<typeof addGroupContactsFormSchema>;
