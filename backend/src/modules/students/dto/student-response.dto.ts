export class StudentResponseDto {
  id: string;
  userId: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  createdAt: Date;
  updatedAt: Date;
}
