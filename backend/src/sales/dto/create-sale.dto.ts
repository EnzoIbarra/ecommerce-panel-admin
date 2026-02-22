import {
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  ArrayNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  shippingAddress: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
