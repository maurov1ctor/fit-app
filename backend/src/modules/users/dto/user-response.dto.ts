import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
