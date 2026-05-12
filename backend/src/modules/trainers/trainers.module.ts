import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TrainersRepository } from './trainers.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainersController],
  providers: [TrainersService, TrainersRepository],
  exports: [TrainersService, TrainersRepository],
})
export class TrainersModule {}
