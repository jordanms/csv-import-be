import PersonCsvParser from "./PersonCsvParser";
import Person from "../Person.entity";
import Color from "../Color";

describe('PersonCsvParser', () => {

    const personCsvParser = new PersonCsvParser();

    describe('parse', () => {
        const csv = '213,Etta Riley,33,"Egtec Terrace, 997 Zujkor Ridge",WHITE';

        it('should parse csv string to Person', () => {
            expect(personCsvParser.parse(csv)).toBeInstanceOf(Person);
        });

        it('should parse "id" field', () => {
            expect(personCsvParser.parse(csv).id).toBe(213);
        });

        it('should parse "name" field', () => {
            expect(personCsvParser.parse(csv).name).toBe('Etta Riley');
        });

        it('should parse "age" field', () => {
            expect(personCsvParser.parse(csv).age).toBe(33);
        });

        it('should parse "address" field', () => {
            expect(personCsvParser.parse(csv).address).toBe('Egtec Terrace, 997 Zujkor Ridge');
        });

        it('should parse "color" field', () => {
            expect(personCsvParser.parse(csv).color).toBe(Color.WHITE);
        });
    });
});
