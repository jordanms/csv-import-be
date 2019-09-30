import Person from "../../src/person/Person.entity";
import Color from "../../src/person/Color";

const {YELLOW, GREEN, BLUE} = Color;

export default class Persons {

    public static newJohn() {
        return new Person(undefined, 'John Josh', 11, 'b street, 11', YELLOW)
    }

    public static newMary() {
        return new Person(undefined, 'Mary Tuu', 34, 'c street, 14', GREEN)
    }

    public static newToomas() {
        return new Person(undefined, 'Toomas Due', 12, '33 street, 89', BLUE)
    }
}
