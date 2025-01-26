import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { Book } from './book.entity';
import { UpdateResult } from 'typeorm';

@Controller('books')
export class BookController {
  constructor(private readonly service: BookService) {}

  @Get()
  getList(): Promise<Book[]> {
    return this.service.getList();
  }

  @Post()
  create(@Body() book: CreateBookDto): Promise<Book> {
    return this.service.create(book);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: Book['id'],
    @Body() body: UpdateBookDto,
  ): Promise<UpdateResult> {
    return this.service.updateBy({ id }, body);
  }

  @Delete(':id')
  deleteById(@Param('id') id: Book['id']) {
    return this.service.deleteBy({ id });
  }
}
