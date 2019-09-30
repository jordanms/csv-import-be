export default interface CsvParser<T> {
    parse(value: string): T
}
