import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Глобальный фильтр для обработки всех исключений в приложении.
 * Перехватывает ошибки и возвращает унифицированный JSON-ответ.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    }
    else if (exception instanceof Error) {
      message = exception.message;
      
      if (message.toLowerCase().includes('not found')) {
        status = HttpStatus.NOT_FOUND;
      } else if (
        message.toLowerCase().includes('forbidden') ||
        message.toLowerCase().includes('admin access')
      ) {
        status = HttpStatus.FORBIDDEN;
      } else if (
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('credentials') ||
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('token')
      ) {
        status = HttpStatus.UNAUTHORIZED;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      error: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}