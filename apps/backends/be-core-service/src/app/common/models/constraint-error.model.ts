import { QueryFailedError } from 'typeorm';
import { PgCodesEnum } from '../../common/models/pg-codes.enum';

export interface ConstraintError extends QueryFailedError {
  code: PgCodesEnum;
}
