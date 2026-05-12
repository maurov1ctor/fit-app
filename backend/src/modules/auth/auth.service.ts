import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, role } = registerDto;

    // Verificar se usuário já existe
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Usuário já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      role: role as UserRole,
    });

    // Gerar tokens
    return this.generateTokens(user.id, user.role);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Invalidar tokens antigos para segurança
    await this.authRepository.deleteAllRefreshTokensForUser(user.id);

    // Gerar novos tokens
    return this.generateTokens(user.id, user.role);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verificar token no DB
    const tokenRecord = await this.authRepository.findRefreshToken(refreshToken);
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    // Buscar usuário
    const user = await this.authRepository.findUserByEmail(tokenRecord.user.email); // Assumindo relação
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Invalidar token antigo (rotação)
    await this.authRepository.deleteRefreshToken(refreshToken);

    // Gerar novos tokens
    return this.generateTokens(user.id, user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    // Invalidar token
    await this.authRepository.deleteRefreshToken(refreshToken);
  }

  private async generateTokens(userId: string, role: UserRole): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, role };

    // Access token (curto)
    const accessToken = this.jwtService.sign(payload);

    // Refresh token (longo, armazenado no DB)
    const refreshTokenValue = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Salvar refresh token no DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    await this.authRepository.createRefreshToken({
      token: refreshTokenValue,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  async validateRefreshToken(token: string): Promise<any> {
    return this.authRepository.findRefreshToken(token);
  }

  async validateUser(userId: string): Promise<any> {
    // Buscar usuário por ID (para JWT payload.sub)
    // Assumindo que AuthRepository tem método findUserById
    const user = await this.authRepository.findUserById(userId);
    return user ? { id: user.id, role: user.role } : null;
  }
}