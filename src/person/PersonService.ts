import {Inject, Injectable} from "@nestjs/common";
import Person from "./Person.entity";
import {PersonRepository} from "./PersonRepository";
import {Readable} from "stream";
import PersonCsvImporter from "./csv/PersonCsvImporter";
import CsvImporter from "../csv/CsvImporter";

@Injectable()
export default class PersonService {

    constructor(
        private readonly personRepository: PersonRepository,
        @Inject('PersonCsvImporter') private readonly personCsvImporter: CsvImporter<Person>
    ) {
    }

    searchByName(name: string, limit: number = 0): Promise<Person[]> {
        return this.personRepository.findByNameLikeCaseInsensitiveLimit(name, limit ? limit : 0);
    }

    async importCsv(is: Readable): Promise<void> {
        return this.personCsvImporter.import(is);
    }
}
