import {
  Controller,
  Get,
  Inject,
  type HttpRedirectResponse,
  Logger,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../app.validation';
import { callbackQuerySchema } from './auth.validation';
import * as z from 'zod';
import {
  VerifyEmailStatusDto,
  type ProfileDto,
} from '@repo/shared-schema/schema';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly stateCookieName: string;
  private readonly accessTokenCookieName = 'access_token';
  private readonly refreshTokenCookieName = 'refresh_token';
  private readonly idTokenCookieName = 'id_token';

  private readonly stateCookieMaxAge = 15 * 60 * 1000; // 15 minutes
  private readonly refreshTokenMaxAge = 30 * 24 * 3600 * 1000; // 30 days

  private readonly cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvVariables, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.stateCookieName = this.configService.get('STATE_COOKIE_NAME');
  }

  @Get('login')
  @Redirect()
  redirectToLogin(
    @Res({ passthrough: true }) res: Response,
  ): HttpRedirectResponse {
    const { loginUrl, randomState } = this.authService.buildLoginUrl();
    res.cookie(this.stateCookieName, randomState, {
      ...this.cookieOptions,
      maxAge: this.stateCookieMaxAge,
    });
    return {
      url: loginUrl,
      statusCode: 302,
    };
  }

  @Get('register')
  @Redirect()
  redirectToRegister(
    @Res({ passthrough: true }) res: Response,
  ): HttpRedirectResponse {
    const { registerUrl, randomState } = this.authService.buildRegisterUrl();
    res.cookie(this.stateCookieName, randomState, {
      ...this.cookieOptions,
      maxAge: this.stateCookieMaxAge,
    });
    return {
      url: registerUrl,
      statusCode: 302,
    };
  }

  @Get('logout')
  @Redirect()
  async redirectToLogout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<HttpRedirectResponse> {
    const logoutUrl = this.authService.buildLogoutUrl();

    await this.authService.invalidateCacheForUser({
      accessToken: z.string().parse(req.cookies[this.accessTokenCookieName]),
      idToken: z.string().parse(req.cookies[this.idTokenCookieName]),
    });

    res.clearCookie(this.accessTokenCookieName, { path: '/' });
    res.clearCookie(this.refreshTokenCookieName, { path: '/' });
    res.clearCookie(this.idTokenCookieName, { path: '/' });

    return {
      url: logoutUrl,
      statusCode: 302,
    };
  }

  @Get('clear-cookies')
  async clearCookies(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<string> {
    await this.authService.invalidateCacheForUser({
      accessToken: z
        .string()
        .optional()
        .parse(req.cookies[this.accessTokenCookieName]),
      idToken: z.string().optional().parse(req.cookies[this.idTokenCookieName]),
    });

    res.clearCookie(this.accessTokenCookieName, { path: '/' });
    res.clearCookie(this.refreshTokenCookieName, { path: '/' });
    res.clearCookie(this.idTokenCookieName, { path: '/' });
    res.clearCookie(this.stateCookieName, { path: '/' });
    return 'Cookies cleared';
  }

  @Get('callback')
  @Redirect()
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<HttpRedirectResponse> {
    const savedState = z.string().parse(req.cookies[this.stateCookieName]);
    if (!savedState || savedState !== state) {
      this.logger.error('State mismatch or missing state cookie');
      throw new UnauthorizedException('Invalid state');
    }

    ({ code, state } = callbackQuerySchema.parse({ code, state }));
    const exchangedToken = await this.authService.exchangeToken(code);

    const maxAge = exchangedToken.expires_in * 1000;

    this.logger.debug(
      `Setting auth cookies: ${JSON.stringify(exchangedToken)}`,
    );

    res.cookie(this.accessTokenCookieName, exchangedToken.access_token, {
      ...this.cookieOptions,
      maxAge,
    });
    res.cookie(this.refreshTokenCookieName, exchangedToken.refresh_token, {
      ...this.cookieOptions,
      maxAge: this.refreshTokenMaxAge,
    });
    res.cookie(this.idTokenCookieName, exchangedToken.id_token, {
      ...this.cookieOptions,
      maxAge,
    });
    res.clearCookie(this.stateCookieName, { path: '/' });

    return {
      url: this.configService.get('AUTH0_LOGIN_REDIRECT_URL'),
      statusCode: 302,
    };
  }

  @Get('profile')
  async getProfile(@Req() req: Request): Promise<ProfileDto> {
    let idToken;
    try {
      idToken = z.string().parse(req.cookies[this.idTokenCookieName]);
    } catch {
      this.logger.error('Missing or invalid ID token cookie');
      throw new UnauthorizedException();
    }

    const userInfo = await this.authService.decodeIdToken(idToken);
    await this.authService.ensureUserInDb(userInfo);
    return userInfo;
  }

  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug('Refreshing access token...');
    let refreshToken;
    try {
      refreshToken = z.string().parse(req.cookies[this.refreshTokenCookieName]);
      this.logger.debug('Refreshed token');
    } catch (e) {
      if (e instanceof z.ZodError) {
        throw new UnauthorizedException();
      } else {
        this.logger.error(
          'Unexpected error while parsing refresh token cookie',
          e,
        );
        throw e;
      }
    }
    const refreshTokenResponse =
      await this.authService.refreshToken(refreshToken);

    const maxAge = refreshTokenResponse.expires_in * 1000;

    res.cookie(this.accessTokenCookieName, refreshTokenResponse.access_token, {
      ...this.cookieOptions,
      maxAge,
    });
    if (refreshTokenResponse.id_token) {
      res.cookie(this.idTokenCookieName, refreshTokenResponse.id_token, {
        ...this.cookieOptions,
        maxAge,
      });
    }
  }

  @Get('resent-verification-email')
  async resendVerificationEmail(@Req() req: Request) {
    const accessToken = z
      .string()
      .parse(req.cookies[this.accessTokenCookieName]);
    const userId = (await this.authService.getUserThroughEndpoint(accessToken))
      .sub;
    await this.authService.resendVerificationEmail(userId);
  }

  @Get('verify-email-status')
  async getEmailVerificationStatus(
    @Req() req: Request,
  ): Promise<VerifyEmailStatusDto> {
    try {
      const accessToken = z
        .string()
        .parse(req.cookies[this.accessTokenCookieName]);
      const userInfo =
        await this.authService.getUserThroughEndpoint(accessToken);
      await this.authService.ensureUserInDb(userInfo);
      return { email_verified: userInfo.email_verified };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
