import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import Color from './Color';

@Entity()
export default class Person {

    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    readonly name: string;

    @Column('int')
    readonly age: number;

    @Column()
    readonly address: string;

    @Column({
        type: "enum",
        enum: Color
    })
    readonly color: Color;

    constructor(id: number, name: string, age: number, address: string, color: Color) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.address = address;
        this.color = color;
    }
}
