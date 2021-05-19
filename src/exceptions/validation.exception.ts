import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationExceptionResponse } from '../interfaces/validation-exception-response.interface';

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(ValidationException.formatResponse(errors), HttpStatus.BAD_REQUEST);
    this.name = 'ValidationError';
  }

  static formatResponse(
    errors: ValidationError[],
    parent?: string,
  ): ValidationExceptionResponse[] {
    let response: ValidationExceptionResponse[] = [];
    for (const error of errors) {
      const path = [parent, error.property].filter((i) => !!i).join('.');
      if (error.constraints) {
        response = response.concat(
          Object.entries(error.constraints).map(([constraint, message]) => ({
            path,
            constraint,
            message,
          })),
        );
      }
      if (error.children) {
        response = response.concat(
          ValidationException.formatResponse(error.children, path),
        );
      }
    }
    return response;
  }
}
