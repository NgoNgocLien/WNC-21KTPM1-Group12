import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('actors')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @ApiResponse({ status: 201, description: 'Actor created successfully', example: { first_name: 'First Name', last_name: 'Last Name' } })
  @ApiResponse({ status: 400, description: 'Bad Request', example: { first_name: 'First Name' }  })
  @Post()
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  findAll() {
    return this.actorsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Success', example: { first_name: 'First Name' } })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(id, updateActorDto);
  }

  @ApiResponse({ status: 200, description: 'Success' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.remove(id);
  }
}
