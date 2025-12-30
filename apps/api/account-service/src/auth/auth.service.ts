import { EnvVariables } from '../app.validation';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationClient, ManagementClient, UserInfoClient } from 'auth0';
import { randomBytes } from 'crypto';
import { decodeJwt } from 'jose';
import {
  exchangedTokenResponseSchema,
  ManagementUserInfo,
  managementUserInfoSchema,
  RefreshTokenResponse,
  refreshTokenResponseSchema,
  UserInfo,
  userInfoSchema,
} from './auth.validation';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly auth0Domain: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;
  private readonly auth0Audience: string;
  private readonly auth0ManagementApiIdentifier: string;
  private readonly auth0RedirectUrl: string;
  private readonly auth0CallbackUrl: string;
  private readonly auth0AuthClient: AuthenticationClient;
  private readonly auth0UserInfoClient: UserInfoClient;
  private readonly auth0ManagementClient: ManagementClient;
  private readonly auth0RequestScope = 'openid profile email offline_access';

  constructor(
    private readonly configService: ConfigService<EnvVariables, true>,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.auth0Domain = this.configService.get('AUTH0_DOMAIN');
    this.auth0ClientId = this.configService.get('AUTH0_CLIENT_ID');
    this.auth0ClientSecret = this.configService.get('AUTH0_CLIENT_SECRET');
    this.auth0Audience = this.configService.get('AUTH0_AUDIENCE');
    this.auth0ManagementApiIdentifier = this.configService.get(
      'AUTH0_MANAGEMENT_API_IDENTIFIER',
    );
    this.auth0RedirectUrl = this.configService.get('AUTH0_REDIRECT_URL');
    this.auth0CallbackUrl = this.configService.get('AUTH0_CALLBACK_URL');

    this.auth0AuthClient = new AuthenticationClient({
      domain: this.auth0Domain,
      clientId: this.auth0ClientId,
      clientSecret: this.auth0ClientSecret,
    });
    this.auth0UserInfoClient = new UserInfoClient({
      domain: this.auth0Domain,
    });
    this.auth0ManagementClient = new ManagementClient({
      domain: this.auth0Domain,
      clientId: this.auth0ClientId,
      clientSecret: this.auth0ClientSecret,
      audience: this.auth0ManagementApiIdentifier,
    });
  }

  private generateRandomState(): string {
    return randomBytes(16).toString('hex');
  }

  private buildBaseAuthUrl(screenHint: 'signup' | 'login'): {
    url: string;
    state: string;
  } {
    const state = this.generateRandomState();
    let url =
      `https://${this.auth0Domain}/authorize?` +
      `response_type=code&` +
      `client_id=${this.auth0ClientId}&` +
      `redirect_uri=${encodeURIComponent(this.auth0CallbackUrl)}&` +
      `scope=${encodeURIComponent(this.auth0RequestScope)}&` +
      `audience=${this.auth0Audience}&` +
      `state=${state}`;

    if (screenHint !== 'login') {
      // since no screen hint means login
      url += `&screen_hint=${screenHint}`;
    }

    this.logger.debug(`Auth url: ${url}`);

    return { url, state };
  }

  buildLogoutUrl(): string {
    return `https://${this.auth0Domain}/v2/logout?client_id=${this.auth0ClientId}&returnTo=${this.auth0RedirectUrl}`;
  }

  buildLoginUrl(): { loginUrl: string; randomState: string } {
    const { url, state } = this.buildBaseAuthUrl('login');
    return { loginUrl: url, randomState: state };
  }

  buildRegisterUrl(): { registerUrl: string; randomState: string } {
    const { url, state } = this.buildBaseAuthUrl('signup');
    return { registerUrl: url, randomState: state };
  }

  async exchangeToken(code: string) {
    const res = await this.auth0AuthClient.oauth.authorizationCodeGrant({
      code,
      redirect_uri: this.auth0CallbackUrl, // don't encode here since the SDK handles it
    });
    this.logger.debug(`Exchanged token response: ${JSON.stringify(res)}`);
    return exchangedTokenResponseSchema.parse(res.data);
  }

  decodeIdToken(idToken: string): UserInfo {
    const decodedToken = decodeJwt(idToken);
    this.logger.debug(`Decoded ID token: ${JSON.stringify(decodedToken)}`);
    return userInfoSchema.parse(decodedToken);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const res = await this.auth0AuthClient.oauth.refreshTokenGrant({
      refresh_token: refreshToken,
    });
    this.logger.debug(`Refresh token response: ${JSON.stringify(res)}`);
    const validatedRes = refreshTokenResponseSchema.parse(res.data);
    return validatedRes;
  }

  async getUserThroughEndpoint(accessToken: string): Promise<UserInfo> {
    const response = (await this.auth0UserInfoClient.getUserInfo(accessToken))
      .data;
    this.logger.debug(`User info response: ${JSON.stringify(response)}`);
    return userInfoSchema.parse(response);
  }

  async getUserInfoBySub(sub: string): Promise<ManagementUserInfo> {
    const user = await this.auth0ManagementClient.users.get(sub);
    this.logger.debug(`Management API user response: ${JSON.stringify(user)}`);
    const userInfo = managementUserInfoSchema.parse(user);
    return userInfo;
  }

  async resendVerificationEmail(userId: string) {
    const result =
      await this.auth0ManagementClient.jobs.verificationEmail.create({
        user_id: userId,
      });
    this.logger.debug(
      `Resend verification email job response: ${JSON.stringify(result)}`,
    );
  }

  async ensureUserInDb(userInfo: UserInfo) {
    await this.prismaService.user.upsert({
      where: { id: userInfo.sub },
      update: {
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
        name: userInfo.name,
        picture: userInfo.picture,
      },
      create: {
        id: userInfo.sub,
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
        name: userInfo.name,
        picture: userInfo.picture,
      },
    });
  }
}
