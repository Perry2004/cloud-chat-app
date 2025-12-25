import { EnvVariables } from '../app.validation';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationClient, UserInfoClient } from 'auth0';
import { randomBytes } from 'crypto';
import { decodeJwt } from 'jose';
import {
  decryptedIdTokenSchema,
  exchangedTokenResponseSchema,
  RefreshTokenResponse,
  refreshTokenResponseSchema,
} from './auth.validation';
import { ProfileDto, profileDtoSchema } from '@repo/shared-schema/schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly auth0Domain: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;
  private readonly auth0Audience: string;
  private readonly auth0RedirectUrl: string;
  private readonly auth0CallbackUrl: string;
  private readonly auth0AuthClient: AuthenticationClient;
  private readonly auth0UserInfoClient: UserInfoClient;
  private readonly auth0RequestScope = 'openid profile email offline_access';

  constructor(
    private readonly configService: ConfigService<EnvVariables, true>,
    private readonly prismaService: PrismaService,
  ) {
    this.auth0Domain = this.configService.get('AUTH0_DOMAIN');
    this.auth0ClientId = this.configService.get('AUTH0_CLIENT_ID');
    this.auth0ClientSecret = this.configService.get('AUTH0_CLIENT_SECRET');
    this.auth0Audience = this.configService.get('AUTH0_AUDIENCE');
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
    return exchangedTokenResponseSchema.parse(
      await this.auth0AuthClient.oauth.authorizationCodeGrant({
        code,
        redirect_uri: this.auth0CallbackUrl, // don't encode here since the SDK handles it
      }),
    );
  }

  decodeIdToken(idToken: string): ProfileDto {
    const decodedToken = decryptedIdTokenSchema.parse(decodeJwt(idToken));
    this.logger.debug(`Decoded ID token: ${JSON.stringify(decodedToken)}`);
    return profileDtoSchema.parse(decodedToken);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const res = refreshTokenResponseSchema.parse(
      await this.auth0AuthClient.oauth.refreshTokenGrant({
        refresh_token: refreshToken,
      }),
    );
    return res;
  }

  // async getUserThroughEndpoint(accessToken: string): Promise<ProfileDto> {
  //   const response = userInfoSchema.parse(
  //     (await this.auth0UserInfoClient.getUserInfo(accessToken)).data,
  //   );
  //   this.logger.debug(`User info response: ${JSON.stringify(response)}`);
  //   return profileDtoSchema.parse(response);
  // }

  async insertOneUser() {
    return await this.prismaService.user.create({
      data: {
        email: 'test@example.email',
      },
    });
  }
}
