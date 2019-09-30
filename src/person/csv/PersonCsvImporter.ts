import {Inject, Injectable} from "@nestjs/common";
import Person from "../Person.entity";
import {PersonRepository} from "../PersonRepository";
import CsvImporter from "../../csv/CsvImporter";
import CsvParser from "../../csv/CsvParser";

@Injectable()
export default class PersonCsvImporter extends CsvImporter<Person> {

    constructor(@Inject('CsvParser') parser: CsvParser<Person>, repository: PersonRepository) {
        super(parser, repository);
    }
}

