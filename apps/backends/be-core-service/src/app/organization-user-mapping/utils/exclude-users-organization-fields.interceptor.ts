import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { OrganizationUserMappingEntity } from '../entities/organization-user-mapping.entity';

@Injectable()
export class ExcludeUsersOrganizationFieldsInterceptor
  implements NestInterceptor
{
  private excludedFields: string[] = ['createdAt', 'userId', 'organizationId'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: OrganizationUserMappingEntity[]) => {
        const result = data.map((item) => {
          // exclude fields without @Expose decorator - according to entity schema
          const retVal = {
            user: instanceToPlain(item.user, {
              excludeExtraneousValues: true,
            }),
            ...instanceToPlain(item, {
              excludeExtraneousValues: true,
            }),
          };

          // customize obj data
          return this.excludeFields(retVal);
        });

        return result;
      }),
    );
  }

  private excludeFields(data) {
    this.excludedFields.forEach((key) => {
      delete data[key];
    });

    return data;
  }
}
