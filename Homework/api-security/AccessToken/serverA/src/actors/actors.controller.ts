import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
  LoggerService,
  Ip,
  UseGuards,
} from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(
    private readonly actorsService: ActorsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Ip() ip: string, @Body() createActorDto: CreateActorDto) {
    const data = await this.actorsService.create(createActorDto);

    this.logger.log(
      `Request: POST /api/actors - Body: ${JSON.stringify(createActorDto)} - ${ip}`,
      ActorsController.name,
    );
    this.logger.log(
      `Response: POST /api/actors - Body: ${JSON.stringify(data)} - ${ip}`,
      ActorsController.name,
    );

    return data;
  }

  @Get()
  async findAll(@Ip() ip: string) {
    const data = await this.actorsService.findAll();

    this.logger.log(`Request: GET /api/actors - ${ip}`, ActorsController.name);
    this.logger.log(
      `Response: GET /api/actors - Body: ${JSON.stringify(data)} - ${ip}`,
      ActorsController.name,
    );

    return data;
  }

  @Get(':id')
  async findOne(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const data = await this.actorsService.findOne(id);

    this.logger.log(
      `Request: GET /api/actors/${id} - ${ip}`,
      ActorsController.name,
    );
    this.logger.log(
      `Response: GET /api/actors/${id} - Body: ${JSON.stringify(data)} - ${ip}`,
      ActorsController.name,
    );

    return data;
  }

  @Patch(':id')
  async update(
    @Ip() ip: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    const data = await this.actorsService.update(id, updateActorDto);

    this.logger.log(
      `Request: PATCH /api/actors/${id} - Body: ${JSON.stringify(updateActorDto)} - ${ip}`,
      ActorsController.name,
    );
    this.logger.log(
      `Response: PATCH /api/actors/${id} - Body: ${JSON.stringify(data)} - ${ip}`,
      ActorsController.name,
    );

    return data;
  }

  @Delete(':id')
  async remove(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const data = await this.actorsService.remove(id);

    this.logger.log(
      `Request: DELETE /api/actors/${id} - ${ip}`,
      ActorsController.name,
    );
    this.logger.log(
      `Response: DELETE /api/actors/${id} - Body: ${JSON.stringify(data)} - ${ip}`,
      ActorsController.name,
    );

    return data;
  }
}
