import Person from "../Person.entity";
import Color from "../Color";
import {Injectable} from "@nestjs/common";
import CsvParser from "../../csv/CsvParser";

@Injectable()
export default class PersonCsvParser implements CsvParser<Person> {

    private readonly id: string = 'id';
    private readonly name: string = 'name';
    private readonly age: string = 'age';
    private readonly address: string = 'address';
    private readonly color: string = 'color';

    public parse(csvPerson: string) {
        let source = csvPerson;
        const person = {};

        source = this.parseId(person, source);
        source = this.parseName(person, source);
        source = this.parseAge(person, source);
        source = this.parseAddress(person, source);
        this.parseColor(person, source);

        return new Person(person[this.id], person[this.name], person[this.age], person[this.address], person[this.color]);
    }

    parseIntField(field: string, person: {}, source: string): string {
        let remaining = this.parseField(field, person, source);
        person[field] = parseInt(person[field]);
        return remaining;
    }

    private parseId(person: {}, source: string): string {
        return this.parseIntField(this.id, person, source);
    }

    private parseName(person: {}, source: string): string {
        return this.parseField(this.name, person, source);
    }

    private parseAge(person: {}, source: string): string {
        let remaining = this.parseField(this.age, person, source);
        person[this.age] = parseInt(person[this.age]);
        return remaining;
    }

    private parseAddress(person: {}, source: string): string {
        let remaining = source.substring(1); // consumes "
        remaining = this.parseField(this.address, person, remaining, '"');
        return remaining.substring(1); // consumes ,
    }

    private parseColor(person: {}, source: string): string {
        let remaining = this.parseField(this.color, person, source);
        person[this.color] = Color[person[this.color]];
        return remaining;
    }

    private parseField(field: string, person: {}, source: string, separator: string = ','): string {
        const firstSeparator = source.indexOf(separator);
        return firstSeparator >= 0
            ? this.parseMiddleField(field, person, source, firstSeparator)
            : this.parseLastField(field, person, source);
    }

    private parseMiddleField(field: string, person: {}, source: string, valueLength: number): string {
        person[field] = source.substring(0, valueLength);
        return source.substring(valueLength + 1);
    }

    private parseLastField(field: string, person: {}, source: string): string {
        person[field] = source;
        return '';
    }
}
