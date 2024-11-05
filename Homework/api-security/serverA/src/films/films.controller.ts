import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Ip, Inject, LoggerService,
   HttpException, HttpStatus
 } from '@nestjs/common';
 import { HttpService } from '@nestjs/axios';
 import { firstValueFrom } from 'rxjs';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@ApiTags('films')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('films')
export class FilmsController {
  constructor(
    private readonly httpService: HttpService,
    // private readonly filmsService: FilmsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @ApiResponse({ status: 201, description: 'Film created successfully', example: { title: 'Film Title', language_id: 1 } })
  @ApiResponse({ status: 400, description: 'Bad Request', example: { title: 'Film Title' }  })
  @Post()
  async create(@Ip() ip: string, @Body() createFilmDto: CreateFilmDto) {
    // const data = await this.filmsService.create(createFilmDto);
    const response = await firstValueFrom(this.httpService.post('http://localhost:5000/api/films', createFilmDto));

    this.logger.log(`Request: POST /api/films - Body: ${JSON.stringify(createFilmDto)} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: POST /api/films - Body: ${JSON.stringify(response.data)} - ${ip}`, FilmsController.name);

    return response.data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  async findAll(@Ip() ip: string) {
    const response = await firstValueFrom(this.httpService.get('http://localhost:5000/api/films'));

    this.logger.log(`Request: GET /api/films - ${ip}`, FilmsController.name);
    this.logger.log(`Response: GET /api/films - Body: ${JSON.stringify(response.data)} - ${ip}`, FilmsController.name);

    return response.data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':id')
  async findOne(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const response = await firstValueFrom(this.httpService.get(`http://localhost:5000/api/films/${id}`));

    this.logger.log(`Request: GET /api/films/${id} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: GET /api/films/${id} - Body: ${JSON.stringify(response.data)} - ${ip}`, FilmsController.name);

    return response.data;
  }

  @ApiResponse({ status: 200, description: 'Success', example: { title: 'Film Title' } })
  @Patch(':id')
  async update(@Ip() ip: string, @Param('id', ParseIntPipe) id: number, @Body() updateFilmDto: UpdateFilmDto) {
    const response = await firstValueFrom(this.httpService.patch(`http://localhost:5000/api/films/${id}`, updateFilmDto));

    this.logger.log(`Request: PATCH /api/films/${id} - Body: ${JSON.stringify(updateFilmDto)} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: PATCH /api/films/${id} - Body: ${JSON.stringify(response.data)} - ${ip}`, FilmsController.name);

    return response.data;
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Delete(':id')
  async remove(@Ip() ip: string, @Param('id', ParseIntPipe) id: number) {
    const response = await firstValueFrom(this.httpService.delete(`http://localhost:5000/api/films/${id}`));

    this.logger.log(`Request: DELETE /api/films/${id} - ${ip}`, FilmsController.name);
    this.logger.log(`Response: DELETE /api/films/${id} - Body: ${JSON.stringify(response.data)} - ${ip}`, FilmsController.name);

    return response.data;
  }
}
