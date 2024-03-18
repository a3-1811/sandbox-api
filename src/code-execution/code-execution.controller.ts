import {
  Controller,
  Post,
  Body,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as Docker from 'dockerode';
import { ExecutedCode } from '../interfaces/executed-code.interface';

@Controller('api')
export class CodeExecutionController {
  private readonly logger = new Logger(CodeExecutionController.name);
  private docker: Docker;
  private readonly MAIN_IMAGE = 'huynq1811/multi-language-sandbox';
  private readonly SUPPORTED_LANGUAGES = ['python', 'java'];

  constructor() {
    this.docker = new Docker();
  }

  async onApplicationBootstrap() {
    try {
      await Promise.all([
        this.pullDockerImage(this.MAIN_IMAGE),
        // Add more languages as needed
      ]);
    } catch (error) {
      this.logger.error(`Error during Docker image pulling: ${error.message}`);
    }
  }

  private async pullDockerImage(name: string) {
    this.logger.log(`Pulling Docker image for ${name}...`);
    await this.docker.pull(name);
    this.logger.log(`Docker image for ${name} pulled successfully`);
  }

  @Post('execute')
  async executeCode(
    @Body() executedCode: ExecutedCode,
    @Res() res: Response,
  ): Promise<any> {
    const { language, code } = executedCode;

    try {
      if (!this.SUPPORTED_LANGUAGES.includes(language)) {
        throw new Error('Unsupported language');
      }

      // Create Docker container
      const container = await this.docker.createContainer({
        Image: this.MAIN_IMAGE,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: [language, code],
      });

      // Start Docker container
      await container.start();

      // Capture container output
      let output = '';
      let error = false;

      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      stream.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      stream.on('end', () => {
        if (output.includes('Error:')) {
          error = true;
        }
      });

      // Wait for the container to exit
      await container.wait();

      // Remove Docker container
      await container.remove();
      output = this.sanitizeOutput(output);
      
      res
        .status(error ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
        .send({ output });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        message: error?.message || 'Error executing code',
      });
    }
  }
  private sanitizeOutput(output: string): string {
    // Implement any necessary sanitization logic here
    // For example, remove non-printable characters
    return output.replace(/[^\x20-\x7E]/g, '');
  }
}
