import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { ExercisesRepository } from './exercises.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExercisesRepository],
  exports: [ExercisesService, ExercisesRepository],
})
export class ExercisesModule {}
