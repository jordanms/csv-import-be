import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import getDatabaseConfig from './DatabaseConfig'
import {PersonModule} from "./person/person.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(getDatabaseConfig()),
        PersonModule
    ]
})
export class AppModule {
}
