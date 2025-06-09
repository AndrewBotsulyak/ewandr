/**
 * "23505" - The PostgreSQL 23505 UNIQUE VIOLATION error occurs when a unique constraint is violated.
 * This means that the application is trying to insert a duplicate value into a column that
 * has a unique constraint. This can cause the application to crash or fail to complete the operation.
 */
export enum PgCodesEnum {
  UNIQUE_VIOLATION = '23505',
}
