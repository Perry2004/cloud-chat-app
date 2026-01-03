import * as z from 'zod';

export const callbackQuerySchema = z.union([
  z.object({
    code: z.string(),
    state: z.string(),
  }),
  z.object({
    error: z.string(),
    error_description: z.string(),
    state: z.string(),
  }),
]);
export type CallbackQueryParams = z.infer<typeof callbackQuerySchema>;

export const exchangedTokenResponseSchema = z.object({
  access_token: z.string(),
  id_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  expires_in: z.number(),
});
export type ExchangedTokenResponse = z.infer<
  typeof exchangedTokenResponseSchema
>;

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
  access_token: z.string(),
  id_token: z.string(),
  scope: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export const managementUserInfoSchema = z.object({
  created_at: z.coerce.date(),
  email: z.email(),
  email_verified: z.boolean(),
  identities: z.array(
    z.object({
      connection: z.string(),
      provider: z.string(),
      user_id: z.string(),
      isSocial: z.boolean(),
    }),
  ),
  name: z.string(),
  nickname: z.string(),
  picture: z.url(),
  updated_at: z.coerce.date(),
  user_id: z.string(),
  last_ip: z.string(),
  last_login: z.coerce.date(),
  logins_count: z.number(),
});
export type ManagementUserInfo = z.infer<typeof managementUserInfoSchema>;
