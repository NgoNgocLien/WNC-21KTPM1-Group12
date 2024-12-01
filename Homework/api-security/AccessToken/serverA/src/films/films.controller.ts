import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Ip, Inject, LoggerService } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@ApiTags('filmsA')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('filmsA')
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @ApiResponse({ status: 201, description: 'Film created successfully', example: { title: 'Film Title', language_id: 1 } })
  @ApiResponse({ status: 400, description: 'Bad Request', example: { title: 'Film Title' }  })
  @Post()
  async create(@Ip() ip: string, @Body() createFilmDto: CreateFilmDto) {
    const data = await this.filmsService.create(createFilmDto);

    this.logger.log(`Request: POST /api/filmsA - Body: ${JSON.stringify(createFilmDto)} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: POST /api/filmsA - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);

    return data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  async findAll(@Ip() ip: string) {
    const data = await this.filmsService.findAll();

    this.logger.log(`Request: GET /api/filmsA - ${ip}`, FilmsController.name);
    this.logger.log(`Response: GET /api/filmsA - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);

    return data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':id')
  async findOne(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const data = await this.filmsService.findOne(id);

    this.logger.log(`Request: GET /api/filmsA/${id} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: GET /api/filmsA/${id} - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);

    return data;
  }

  @ApiResponse({ status: 200, description: 'Success', example: { title: 'Film Title' } })
  @Patch(':id')
  update(@Ip() ip: string, @Param('id', ParseIntPipe) id: number, @Body() updateFilmDto: UpdateFilmDto) {
    const data = this.filmsService.update(id, updateFilmDto);

    this.logger.log(`Request: PATCH /api/filmsA/${id} - Body: ${JSON.stringify(updateFilmDto)} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: PATCH /api/filmsA/${id} - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);

    return data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Delete(':id')
  remove(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const data = this.filmsService.remove(id);

    this.logger.log(`Request: DELETE /api/filmsA/${id} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: DELETE /api/filmsA/${id} - Body: ${JSON.stringify(data)} - ${ip}`, FilmsController.name);

    return data;
  }
}
