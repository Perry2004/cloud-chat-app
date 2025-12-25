import * as z from 'zod';

export const callbackQuerySchema = z.object({
  code: z.string(),
  state: z.string(),
});
export type CallbackQueryParams = z.infer<typeof callbackQuerySchema>;

export const exchangedTokenResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    id_token: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
  }),
  status: z.number(),
});
export type ExchangedTokenResponse = z.infer<
  typeof exchangedTokenResponseSchema
>;

export const decryptedIdTokenSchema = z.object({
  nickname: z.string(),
  name: z.string(),
  picture: z.url(),
  updated_at: z.coerce.date(),
  email: z.email(),
  email_verified: z.boolean(),
  iss: z.url(),
  aud: z.string(),
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
  sid: z.string(),
});
export type DecryptedIdToken = z.infer<typeof decryptedIdTokenSchema>;

export const userInfoSchema = z.object({
  sub: z.string(),
  nickname: z.string(),
  name: z.string(),
  picture: z.url(),
  updated_at: z.coerce.date(),
  email: z.email(),
  email_verified: z.boolean(),
});
export type UserInfo = z.infer<typeof userInfoSchema>;

export const refreshTokenResponseSchema = z.object({
  data: z.object({
    access_token: z.string(),
    id_token: z.string(),
    scope: z.string(),
    expires_in: z.number(),
    token_type: z.string(),
    status: z.number(),
  }),
  status: z.number(),
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
