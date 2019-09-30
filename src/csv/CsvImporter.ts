import * as readline from "readline";
import CsvParser from "./CsvParser";
import {Repository} from "typeorm";
import {Readable} from "stream";

export default class CsvImporter<T> {

    constructor(private readonly parser: CsvParser<T>, private readonly repository: Repository<T>) {
    }

    public import(is: Readable): Promise<void> {
        return new Worker(this.parser, this.repository).import(is);
    }
}

class Worker<T> {

    private static readonly FLUSH_ON: number = 1000;

    private entities: T[];
    private onGoingInserts: number;
    private readonly parser: CsvParser<T>;
    private readonly repository: Repository<T>;

    constructor(parser: CsvParser<T>, repository: Repository<T>) {
        this.parser = parser;
        this.repository = repository;
        this.entities = [];
        this.onGoingInserts = 0;
    }

    public import(is: Readable): Promise<void> {
        return new Promise<void>((resolve) => {
            const readInterface = readline.createInterface({
                input: is
            });

            readInterface.on('line', (line) => {
                const person = this.parser.parse(line);
                this.entities.push(person);
                this.flush();
            });

            readInterface.on('close', () => {
                this.flush(true);
                this.tryResolve(resolve);
            });
        });
    }

    private flush(force: boolean = false) {
        if (force || this.entities.length % Worker.FLUSH_ON == 0) {
            this.save();
        }
    }

    private save() {
        if (this.entities.length > 0) {
            const copy = this.clearEntities();
            this.repository.insert(copy)
                .then(() => this.onGoingInserts--)
                .catch((reason) => {
                    console.log(`Failed to import Persons:\n${reason}`);
                    this.onGoingInserts--;
                });
            this.onGoingInserts++;
        }
    }

    private clearEntities(): T[] {
        const copy = this.entities;
        this.entities = [];
        return copy;
    }

    private tryResolve(resolve: () => void) {
        setTimeout(() => this.onGoingInserts ? this.tryResolve(resolve) : resolve());
    }
}
