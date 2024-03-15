import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeExecutionController } from './code-execution/code-execution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'huypro',
      database: 'sandbox',
      entities: [],
      synchronize: true, // Auto-create database schema (for development only)
    }),
  ],
  controllers: [AppController, CodeExecutionController],
  providers: [AppService],
})
export class AppModule {}
