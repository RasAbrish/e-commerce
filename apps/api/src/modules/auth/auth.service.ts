import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterInput, LoginInput } from '@bright-ideas/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: 'CUSTOMER',
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Store hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Store hashed refresh token and update last login
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), refreshToken: hashedRefreshToken },
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-token-key-bright-ideas-2026',
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Rotate tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store the hashed token in refreshToken field (reusing the field for simplicity)
    // In production, you'd have a separate password_reset_tokens table
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: `reset:${resetTokenHash}:${Date.now() + 3600000}` },
    });

    // In dev, log the reset link. In production, send email.
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${user.email}`;
    console.log(`\n🔑 Password Reset Link for ${user.email}:\n${resetUrl}\n`);

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching reset token
    const users = await this.prisma.user.findMany({
      where: {
        refreshToken: { startsWith: `reset:${tokenHash}:` },
      },
    });

    if (users.length === 0) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = users[0];
    const parts = user.refreshToken!.split(':');
    const expiry = parseInt(parts[2], 10);

    if (Date.now() > expiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, refreshToken: null },
    });

    return { message: 'Password reset successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-jwt-access-token-key-bright-ideas-2026',
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-token-key-bright-ideas-2026',
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  sanitizeUser(user: any) {
    const { passwordHash, refreshToken, ...sanitized } = user;
    return sanitized;
  }
}

