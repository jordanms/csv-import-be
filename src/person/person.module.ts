import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import PersonService from "./PersonService";
import {PersonController} from "./PersonController";
import {PersonRepository} from "./PersonRepository";
import CsvImporter from "./csv/PersonCsvImporter";
import CsvParser from "./csv/PersonCsvParser";

@Module({
    imports: [TypeOrmModule.forFeature([PersonRepository])],
    providers: [
        PersonService,
        CsvImporter,
        {provide: 'CsvParser', useClass: CsvParser}
    ],
    controllers: [PersonController],
})
export class PersonModule {
}
