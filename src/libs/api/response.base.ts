import { ApiProperty } from '@nestjs/swagger';
import { IdResponse } from './id.response.dto';

export interface BaseResponseProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase extends IdResponse {
  constructor(props: BaseResponseProps) {
    super(props.id);
    if (this.createdAt) {
      this.createdAt = new Date(props.createdAt!).toISOString();
    } else {
      this.createdAt = new Date(props.created_at!).toISOString();
    }

    if (this.updatedAt) {
      this.updatedAt = new Date(props.updatedAt!).toISOString();
    } else {
      this.updatedAt = new Date(props.updated_at!).toISOString();
    }
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly updatedAt: string;
}
