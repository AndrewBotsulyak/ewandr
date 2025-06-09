import { QueryFailedError } from 'typeorm';
import { PgCodesEnum } from '../models/pg-codes.enum';
import { ConflictException } from '@nestjs/common';
import { ConstraintError } from '../models/constraint-error.model';

export function queryFailedErrorHandler(error: unknown) {
  if (error instanceof QueryFailedError) {
    const err = error as ConstraintError;

    if (err.code === PgCodesEnum.UNIQUE_VIOLATION) {
      // PostgreSQL unique violation
      throw new ConflictException('Relation already exists');
    }
  }
}
