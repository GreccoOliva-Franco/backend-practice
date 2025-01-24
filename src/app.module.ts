import { Module } from "@nestjs/common";
import { BookModule } from "./modules/books/book.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./modules/config/database/typeorm-config";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService
        }),

        BookModule,
    ]
})
export class AppModule {}