import { QueryFailedError } from 'typeorm';
import { UniqShopConstraintsNameEnum } from './uniq-shop-constraints-name.enum';
import { PgCodesEnum } from '../../common/models/pg-codes.enum';

export interface ConstraintShopError extends QueryFailedError {
  constraint: UniqShopConstraintsNameEnum;
  code: PgCodesEnum;
}
