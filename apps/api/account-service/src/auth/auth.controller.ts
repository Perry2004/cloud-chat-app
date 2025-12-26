import {
  Controller,
  Get,
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
import { type ProfileDto } from '@repo/shared-schema/schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly stateCookieName: string;
  private readonly accessTokenCookieName = 'access_token';
  private readonly refreshTokenCookieName = 'refresh_token';
  private readonly idTokenCookieName = 'id_token';

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvVariables, true>,
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
      httpOnly: true,
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
      httpOnly: true,
    });
    return {
      url: registerUrl,
      statusCode: 302,
    };
  }

  @Get('logout')
  @Redirect()
  redirectToLogout(
    @Res({ passthrough: true }) res: Response,
  ): HttpRedirectResponse {
    const logoutUrl = this.authService.buildLogoutUrl();

    res.clearCookie(this.accessTokenCookieName);
    res.clearCookie(this.refreshTokenCookieName);
    res.clearCookie(this.idTokenCookieName);

    return {
      url: logoutUrl,
      statusCode: 302,
    };
  }

  @Get('callback')
  @Redirect()
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<HttpRedirectResponse> {
    ({ code, state } = callbackQuerySchema.parse({ code, state }));
    const exchangedToken = await this.authService.exchangeToken(code);

    res.cookie(this.accessTokenCookieName, exchangedToken.data.access_token, {
      httpOnly: true,
    });
    res.cookie(this.refreshTokenCookieName, exchangedToken.data.refresh_token, {
      httpOnly: true,
    });
    res.cookie(this.idTokenCookieName, exchangedToken.data.id_token, {
      httpOnly: true,
    });
    res.clearCookie(this.stateCookieName);

    return {
      url: this.configService.get('AUTH0_LOGIN_REDIRECT_URL'),
      statusCode: 302,
    };
  }

  @Get('profile')
  getProfile(@Req() req: Request): ProfileDto {
    let idToken;
    try {
      idToken = z.string().parse(req.cookies[this.idTokenCookieName]);
    } catch {
      throw new UnauthorizedException();
    }
    return this.authService.decodeIdToken(idToken);
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

    res.cookie(
      this.accessTokenCookieName,
      refreshTokenResponse.data.access_token,
      {
        httpOnly: true,
      },
    );
  }

  @Get('test-insert-user')
  async testInsertUser() {
    return await this.authService.insertOneUser();
  }
}
