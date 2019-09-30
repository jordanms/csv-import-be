import * as request from 'supertest';
import Person from "../person/Person.entity";
import Persons from "../../test/utils/Persons";
import IntegrationTestUtils from "../../test/utils/IntegrationTestUtils";
import {PersonRepository} from "./PersonRepository";

describe('PersonController (/persons)', () => {
    const testUtils = new IntegrationTestUtils();
    let personRepository: PersonRepository;

    const basePath: string = "/persons";

    beforeAll(async () => {
        await testUtils.startApp();
        personRepository = testUtils.getRepository<PersonRepository>(PersonRepository);
    });

    afterAll(async () => {
        await stopApp();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('GET /', () => {
        let persons;

        beforeEach(async () => {
            persons = getPersons();
            await addPersonsToDatabase(persons);
        });

        it('should return empty array when no Person', async () => {
            await clearDatabase();
            return request(testUtils.getHttpServer())
                .get(basePath)
                .expect(200)
                .expect([]);
        });

        it('should return all Persons when there are Persons', async () => {
            return request(testUtils.getHttpServer())
                .get(basePath)
                .expect(200)
                .expect(JSON.stringify(persons));
        });

        it('should return array of Persons whose name matches the query param', async () => {
            return request(testUtils.getHttpServer())
                .get(`${basePath}?query=mary`)
                .expect(200)
                .expect(JSON.stringify(persons.filter((person) => person.name.match('.*Mary.*'))));
        });

        it('should return limited number of Persons when limit param is positive', async () => {
            const limit = 2;
            return request(testUtils.getHttpServer())
                .get(`${basePath}?limit=${limit}`)
                .expect(200)
                .expect(JSON.stringify(persons.slice(0, limit)));
        });

        function getPersons(): Person[] {
            return [
                Persons.newJohn(),
                Persons.newMary(),
                Persons.newToomas()
            ];
        }

        async function addPersonsToDatabase(persons: Person[]): Promise<Person[]> {
            return personRepository.save(persons);
        }
    });

    describe('POST /import', () => {
        const path: string = `${basePath}/import`;
        const testResourcesPath: string = './test/resources';

        it('should import a CSV file with 234 persons', () => {
            return request(testUtils.getHttpServer())
                .post(path)
                .set('Content-Type', 'multipart/form-data')
                .attach('file', `${testResourcesPath}/persons-234.csv`)
                .expect(201)
                .then(async () => {
                    expect(await personRepository.count()).toBe(234);
                });
        });

        it('should import a CSV file with 5000 persons', () => {
            return request(testUtils.getHttpServer())
                .post(path)
                .set('Content-Type', 'multipart/form-data')
                .attach('file', `${testResourcesPath}/persons-5000.csv`)
                .expect(201)
                .then(async () => {
                    expect(await personRepository.count()).toBe(5000);
                });
        });
    });

    async function stopApp(): Promise<void> {
        await clearDatabase();
        await testUtils.stopApp();
    }

    async function clearDatabase(): Promise<void> {
        await personRepository.clear();
    }
});
