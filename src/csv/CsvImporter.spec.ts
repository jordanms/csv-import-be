import CsvParser from "./CsvParser";
import {Repository} from "typeorm";
import {Readable} from "stream";
import CsvImporter from "./CsvImporter";

describe('CsvImporter', () => {

    const names = ['Michael Jordan', 'Luana Piovana', 'Taty Quebra Barraco', 'Alexandre Frota'];

    let csvImporter: CsvImporter<Entity>;
    let is: Readable;
    let repositoryMock: Repository<Entity>;

    beforeEach(() => {
        repositoryMock = new Repository<Entity>();
        csvImporter = new CsvImporter<Entity>(new EntityCsvParser(), repositoryMock);
        is = new Readable();
    });

    describe('import', () => {

        it('should import no Entity when stream is empty', async () => {
            const testResult = whenStreamIsEmpty();

            return csvImporter.import(is)
                .then(() => {
                    expect(testResult.insertCount).toBe(0);
                    expect(testResult.insertedEntities).toStrictEqual(testResult.expectedEntities);
                });
        });

        it('should import Entities in one chunks when stream has few lines', async () => {
            const testResult = whenStreamHasFewLines();

            return csvImporter.import(is)
                .then(() => {
                    expect(testResult.insertCount).toBe(1);
                    expect(testResult.insertedEntities).toStrictEqual(testResult.expectedEntities);
                });
        });

        it('should import Entities in chunks when stream has many lines', async () => {
            const testResult = whenStreamHasManyLines();

            return csvImporter.import(is)
                .then(() => {
                    expect(testResult.insertCount).toBeGreaterThan(1);
                    expect(testResult.insertedEntities).toStrictEqual(testResult.expectedEntities);
                });
        });

        function whenStreamIsEmpty(): TestResult {
            return whenStreamHasLines(0);
        }

        function whenStreamHasFewLines(): TestResult {
            return whenStreamHasLines(87);
        }

        function whenStreamHasManyLines(): TestResult {
            return whenStreamHasLines(2497);
        }

        function whenStreamHasLines(numberOfLines: number): TestResult {
            const testResult = new TestResult();
            prepareStreamAndExpectedEntities(numberOfLines, testResult);
            spyOnRepository(testResult);
            return testResult;
        }

        function prepareStreamAndExpectedEntities(numberOfLines: number, testResult) {
            for (let i = 0; i < numberOfLines; i++) {
                const name = names[i % (names.length - 1)];
                is.push(`${name}\n`);
                testResult.expectedEntities[i] = new Entity(name);
            }
            is.push(null);
        }

        function spyOnRepository(testResult) {
            jest.spyOn(repositoryMock, 'insert').mockImplementation((entities) => {
                testResult.insertCount++;
                testResult.insertedEntities.push(...(entities as Entity[]));
                return new Promise((resolve) => {
                    resolve(null);
                })
            });
        }

        class TestResult {
            readonly expectedEntities: Entity[] = [];
            readonly insertedEntities = [];
            insertCount = 0;
        }
    });

    class Entity {
        constructor(
            public name: string
        ) {
        }
    }

    class EntityCsvParser implements CsvParser<Entity> {
        parse(value: string): Entity {
            return new Entity(value);
        }
    }
});
