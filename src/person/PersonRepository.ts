import {EntityRepository, Repository} from "typeorm";
import Person from "./Person.entity";

@EntityRepository(Person)
export class PersonRepository extends Repository<Person> {
    findByNameLikeCaseInsensitiveLimit(name: string, limit: number): Promise<Person[]> {
        return this.createQueryBuilder()
            .where("LOWER(name) LIKE :name", {name: `%${name.toLowerCase()}%`})
            .limit(limit)
            .getMany();
    }

    /*
        findNameByLikeCaseInsensitiveLimit(name: string, limit: number): Promise<string[]> {
            return this.createQueryBuilder()
                .select("name")
                .distinct(true)
                .where("LOWER(name) LIKE :name", {name: `%${name.toLowerCase()}%`})
                .limit(limit)
                .getRawMany()
                .then(this.extractNames);
        }

        private extractNames(rawData: Array<any>): string[] {
            return rawData.map<string>(rowData => {
                return rowData.name;
            });
        }*/
}
