import {Controller, Get, Post, Query, UploadedFile, UseInterceptors} from "@nestjs/common";
import PersonService from "./PersonService";
import Person from "./Person.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {createReadStream} from 'streamifier';

@Controller('persons'
)
export class PersonController {
    constructor(private readonly personService: PersonService) {
    }

    @Get()
    getPersons(
        @Query('query') query: string = '',
        @Query('limit') limit: number = 0
    ): Promise<Person[]> {
        return limit > 0 ? this.getLimitedNumberOfPersons(query, limit) : this.getAllPersons(query);
    }

    @Post('/import')
    @UseInterceptors(FileInterceptor('file'))
    csvImport(@UploadedFile() file): Promise<void> {
        const is = createReadStream(file.buffer);
        return this.personService.importCsv(is);
    }

    private getLimitedNumberOfPersons(name: string, limit: number) {
        return this.personService.searchByName(name, limit);
    }

    private getAllPersons(name: string) {
        return this.personService.searchByName(name);
    }
}
