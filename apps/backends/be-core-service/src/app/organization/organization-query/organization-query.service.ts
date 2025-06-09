import { Injectable } from '@nestjs/common';
import { ORG_ID_CONTEXT } from '../../common/models/test-values.temporary';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationEntity } from '../entities/organization.entity';
import { Repository } from 'typeorm';
import {
  ORGANIZATION_TABLE_NAME,
  PRODUCT_TABLE_NAME,
  SHOP_TABLE_NAME, SHOP_USER_MAPPING_TABLE_NAME,
  USER_TABLE_NAME,
} from '../../common/models/table-names.const';

@Injectable()
export class OrganizationQueryService {
  organizationId = ORG_ID_CONTEXT;

  constructor(
    @InjectRepository(OrganizationEntity)
    private orgRepository: Repository<OrganizationEntity>,
  ) {}

  async getDetails(id?: number): Promise<any> {
    // TODO org context
    const orgId = id ?? this.organizationId;

    return await this.orgRepository.query(
      `
      SELECT 
        o.id, 
        o.title,
        json_agg(shop_data) AS shops
      FROM "${ORGANIZATION_TABLE_NAME}" o
      JOIN (
        SELECT 
          s.organization_id,
          json_build_object(
            'id', s.id,
            'email', s.email,
            'title', s.title,
            'phone', s.phone,
            'usersCount', COUNT(DISTINCT u.id),
            'products', COUNT(DISTINCT p.id)
          ) AS shop_data
        FROM "${SHOP_TABLE_NAME}" AS s
        LEFT JOIN "${SHOP_USER_MAPPING_TABLE_NAME}" AS um ON um.shop_id = s.id
        LEFT JOIN "${USER_TABLE_NAME}" u ON u.id = um.user_id
        LEFT JOIN "${PRODUCT_TABLE_NAME}" p ON p.shop_id = s.id
        GROUP BY s.id
      ) AS sub ON sub.organization_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
    `,
      [orgId],
    );
  }
}
