import * as z from "zod";

export const profileDtoSchema = z.object({
  nickname: z.string(),
  name: z.string(),
  picture: z.url(),
  updated_at: z.coerce.date(),
  email: z.email(),
  email_verified: z.boolean(),
});
export type ProfileDto = z.infer<typeof profileDtoSchema>;
