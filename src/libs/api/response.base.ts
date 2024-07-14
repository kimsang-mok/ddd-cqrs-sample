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
    if (props.createdAt) {
      this.createdAt = props.createdAt;
    } else {
      this.createdAt = props.created_at!;
    }

    if (props.updatedAt) {
      this.updatedAt = props.updatedAt;
    } else {
      this.updatedAt = props.updated_at!;
    }

    if (props.createdAt) {
      const createdAtDate = new Date(props.createdAt);
      if (!isNaN(createdAtDate.getTime())) {
        this.createdAt = createdAtDate.toISOString();
      } else {
        throw new RangeError('Invalid time value for createdAt');
      }
    }

    if (props.updatedAt) {
      const updatedAtDate = new Date(props.updatedAt);
      if (!isNaN(updatedAtDate.getTime())) {
        this.updatedAt = updatedAtDate.toISOString();
      } else {
        throw new RangeError('Invalid time value for updatedAt');
      }
    }
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly createdAt: Date | string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly updatedAt: Date | string;
}
