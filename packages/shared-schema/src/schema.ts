import * as z from "zod";

export const profileDtoSchema = z.object({
  nickname: z.string(),
  name: z.string(),
  picture: z.url(),
  updated_at: z.coerce.date(),
  email: z.email(),
  email_verified: z.boolean(),
  sub: z.string(),
});
export type ProfileDto = z.infer<typeof profileDtoSchema>;

export const verifyEmailStatusDtoSchema = z.object({
  email_verified: z.boolean(),
});
export type VerifyEmailStatusDto = z.infer<typeof verifyEmailStatusDtoSchema>;
