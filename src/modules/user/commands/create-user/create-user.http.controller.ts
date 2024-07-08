import { Controller } from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(private readonly commandBus: unknown) {}
}
