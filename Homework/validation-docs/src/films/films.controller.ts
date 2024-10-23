import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('films')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiResponse({ status: 201, description: 'Film created successfully', example: { title: 'Film Title', language_id: 1 } })
  @ApiResponse({ status: 400, description: 'Bad Request', example: { title: 'Film Title' }  })
  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Success', example: { title: 'Film Title' } })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.remove(id);
  }
}
