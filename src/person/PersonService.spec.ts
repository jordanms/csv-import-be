import PersonService from "./PersonService";
import Person from "./Person.entity";
import Persons from "../../test/utils/Persons";
import {PersonRepository} from "./PersonRepository";
import CsvImporter from "../csv/CsvImporter";
import PersonCsvImporter from "./csv/PersonCsvImporter";
import PersonCsvParser from "./csv/PersonCsvParser";

describe('PersonService', () => {

    let personService: PersonService;
    let personRepositoryMock: PersonRepository;
    let csvImporter: CsvImporter<Person>;

    beforeEach(() => {
        personRepositoryMock = new PersonRepository();
        csvImporter = new PersonCsvImporter(new PersonCsvParser(), new PersonRepository());
        personService = new PersonService(personRepositoryMock, csvImporter);
    });

    describe('searchByName', () => {

        it('should return all Persons that name matches pattern when no limit is passed', async () => {
            const persons: Person[] = [Persons.newToomas(), Persons.newMary()];
            const namePattern = 'my pattern';
            spyOnRepository(namePattern, 0, persons);

            expect(await personService.searchByName(namePattern)).toStrictEqual(persons);
        });

        it('should return all Persons that name matches pattern when no limit is passed', async () => {
            const persons: Person[] = [Persons.newToomas(), Persons.newMary(), Persons.newJohn()];
            const namePattern = 'my pattern';
            const limit = 5;
            spyOnRepository(namePattern, limit, persons);

            expect(await personService.searchByName(namePattern, limit)).toStrictEqual(persons);
        });

        function spyOnRepository(namePattern: string, limit: number, persons: Person[]) {
            jest.spyOn(personRepositoryMock, 'findByNameLikeCaseInsensitiveLimit').mockImplementation((name, actualLimit) => {
                expect(name).toBe(namePattern);
                expect(actualLimit).toBe(limit);
                return new Promise((resolve) => {
                    resolve(persons);
                });
            });
        }
    });
});
