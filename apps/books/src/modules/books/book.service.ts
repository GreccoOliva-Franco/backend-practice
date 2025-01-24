import { Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dtos/create-book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { DeleteResult, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { UpdateBookDto } from "./dtos/update-book.dto";

@Injectable()
export class BookService {
    constructor(@InjectRepository(Book) private readonly repository: Repository<Book>) {}

    getList(): Promise<Book[]> {
        return this.repository.find()
    }

    create(book: CreateBookDto): Promise<Book> {
        const newBook =  this.repository.create(book);
        return this.repository.save(newBook);
    }

    updateBy(where: FindOptionsWhere<Book>, update: UpdateBookDto): Promise<UpdateResult> {
        return this.repository.update(where, update)
    }

    deleteBy(where: FindOptionsWhere<Book>): Promise<DeleteResult> {
        return this.repository.delete(where)
    }
}