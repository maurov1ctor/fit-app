import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { WorkoutsRepository } from './workouts.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsRepository],
  exports: [WorkoutsService, WorkoutsRepository],
})
export class WorkoutsModule {}
