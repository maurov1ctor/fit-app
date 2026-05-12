export class TrainerResponseDto {
  id: string;
  userId: string;
  specialization?: string;
  certification?: string;
  yearsExperience: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
