import { Module } from '@nestjs/common';
import { WorkoutLogsController } from './workout-logs.controller';
import { WorkoutLogsService } from './workout-logs.service';
import { WorkoutLogsRepository } from './workout-logs.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService, WorkoutLogsRepository],
  exports: [WorkoutLogsService, WorkoutLogsRepository],
})
export class WorkoutLogsModule {}
