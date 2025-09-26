import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { Role, SubRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Patch('forgot/:id')
  @ApiResponse({ type: String, status: 200 })
  forgotPassword(
    @Param('id') id: string,
    @Body() dto: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    if (
      id !== req.user.id &&
      (req.user.subRole !== SubRole.ADMIN || req.user.role !== Role.SUPERADMIN)
    )
      throw new UnauthorizedException(
        `User role ${req.user.role} not permitted for this action`,
      );
    return this.authService.forgot(id, dto);
  }

  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // async refresh(@Body() body: { refreshToken: string }) {
  //   try {
  //     // Verify refresh token
  //     const payload = await this.jwtService.verifyAsync<JwtPayload>(
  //       body.refreshToken,
  //       {
  //         secret: process.env.JWT_REFRESH_SECRET,
  //       },
  //     );
  //
  //     // Optional: Check if user still exists & is active
  //     const user = await this.prisma.user.findUnique({
  //       where: { id: payload.sub },
  //     });
  //
  //     if (!user) {
  //       throw new UnauthorizedException('User not found or inactive');
  //     }
  //
  //     // Issue new access token
  //     const newAccessToken = await this.jwtService.signAsync(
  //       {
  //         sub: user.id,
  //         email: user.email,
  //         role: user.role,
  //       },
  //       {
  //         expiresIn: '1m',
  //       },
  //     );
  //
  //     // Optional: Rotate refresh token (more secure)
  //     const newRefreshToken = await this.jwtService.signAsync(
  //       {
  //         sub: user.id,
  //         email: user.email,
  //         role: user.role,
  //       },
  //       {
  //         expiresIn: '7d',
  //         secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  //       },
  //     );
  //
  //     return {
  //       access_token: newAccessToken,
  //       refresh_token: newRefreshToken, // 👈 rotate for better security
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }
  // }
}
