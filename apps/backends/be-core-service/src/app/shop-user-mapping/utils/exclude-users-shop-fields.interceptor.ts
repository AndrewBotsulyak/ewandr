import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { ShopUserMappingEntity } from '../entities/shop-user-mapping.entity';

@Injectable()
export class ExcludeUsersShopFieldsInterceptor implements NestInterceptor {
  private excludedFields: string[] = ['userId', 'shopId'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ShopUserMappingEntity[]) => {
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
