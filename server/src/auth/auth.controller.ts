import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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
