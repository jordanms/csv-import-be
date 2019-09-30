import Person from "../person/Person.entity";
import Persons from "../../test/utils/Persons";
import {PersonRepository} from "./PersonRepository";
import IntegrationTestUtils from "../../test/utils/IntegrationTestUtils";

describe('PersonRepository', () => {
    const testUtils = new IntegrationTestUtils();
    let personRepository: PersonRepository;

    beforeAll(async () => {
        await testUtils.startApp();
        personRepository = testUtils.getRepository<PersonRepository>(PersonRepository);
    });

    afterAll(async () => {
        await stopApp();
    });

    beforeEach(async () => {
        await clearDatabase();
        await populateDatabase();
    });

    describe('findByNameLikeCaseInsensitive', () => {

        it('should return empty array when no Person with name pattern', () => {
            return testFindByNameLikeCaseInsensitive('no match', '.*no match.*', 0);
        });

        it('should return array of Persons when there are Persons', () => {
            return testFindByNameLikeCaseInsensitive('o', '.*o.*', 2);
        });

        it('should return array of Persons when there are Persons with name pattern and name pattern has different case', () => {
            return testFindByNameLikeCaseInsensitive('M', '.*m|M.*', 2);
        });

        it('should return all Persons when name pattern is empty', () => {
            return testFindByNameLikeCaseInsensitive('', '.*.*', 3);
        });

        it('should escape name so regex symbols are handled as literals', () => {
            return testFindByNameLikeCaseInsensitive('.', '.*\\..*', 0);
        });

        it('should return a limited number of Persons', () => {
            const limit = 2;
            return personRepository.findByNameLikeCaseInsensitiveLimit('', limit)
                .then(persons => {
                    expect(persons).toHaveLength(limit);
                })
        });

        function testFindByNameLikeCaseInsensitive(name: string, namePattern: string, expectedNumberOfPersons: number) {
            return personRepository.findByNameLikeCaseInsensitiveLimit(name, 0)
                .then(persons => {
                    expectArray<Person>(persons, expectedNumberOfPersons, (person) => person.name.match(namePattern));
                })
        }
    });

    /*
        describe('findNameByLikeCaseInsensitive', () => {

            it('should return empty array when no Person with name pattern', () => {
                return testFindNameByLikeCaseInsensitive('no match', '.*no match.*', 0);
            });

            it('should return array of names when there are Persons with name pattern', () => {
                return testFindNameByLikeCaseInsensitive('oo', '.*oo.*', 1);
            });

            it('should return array of names when there are Persons with name pattern and name pattern has different case', () => {
                return testFindNameByLikeCaseInsensitive('mA', '.*(m|M)(a|A).*', 2);
            });

            it('should return all names when name pattern is empty', () => {
                return testFindNameByLikeCaseInsensitive('', '.*.*', 3);
            });

            it('should return a limited number of names', () => {
                const limit = 2;
                return personRepository.findNameByLikeCaseInsensitiveLimit('', limit)
                    .then(names => {
                        expect(names).toHaveLength(limit);
                    })
            });

            it('should return unique names', async () => {
                await addMultipleJohns();
                return testFindNameByLikeCaseInsensitive('John', '.*John.*', 1);
            });

            function testFindNameByLikeCaseInsensitive(name: string, namePattern: string, expectedNumberOfNames: number) {
                return personRepository.findNameByLikeCaseInsensitiveLimit(name, 100)
                    .then(names => {
                        expectArray<string>(names, expectedNumberOfNames, (name) => name.match(namePattern));
                    })
            }

            async function addMultipleJohns() {
                const johns = [Persons.newJohn(), Persons.newJohn(), Persons.newJohn(), Persons.newJohn()];
                await addPersonsToDatabase(johns);
            }
        });*/

    function expectArray<T>(array: Array<T>, expectedLength: number, filter: (element: T) => any) {
        expect(array).toHaveLength(expectedLength);
        expect(array).toStrictEqual(array.filter(filter));
    }

    function populateDatabase(): Promise<Person[]> {
        const persons = getPersons();
        return addPersonsToDatabase(persons);
    }

    function getPersons(): Person[] {
        return [
            Persons.newJohn(),
            Persons.newMary(),
            Persons.newToomas()
        ];
    }

    async function addPersonsToDatabase(persons: Person[]): Promise<Person[]> {
        return await personRepository.save(persons);
    }

    async function stopApp(): Promise<void> {
        await clearDatabase();
        await testUtils.stopApp();
    }

    function clearDatabase(): Promise<void> {
        return personRepository.clear();
    }
});
