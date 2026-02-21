import { IsEnum } from 'class-validator';
import { SaleStatus } from '@prisma/client';

export class UpdateSaleStatusDto {
  @IsEnum(SaleStatus)
  status: SaleStatus;
}
