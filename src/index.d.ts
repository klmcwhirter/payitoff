
interface Date {
    compareShortDate(date2: Date): number;
    isShortDateEqual(date2: Date): boolean;
    isShortDateGreater(date2: Date): boolean;
    isShortDateGreaterEqual(date2: Date): boolean;
    toFirstOfTheMonthString(): string;
    toShortDateString(): string;
}

interface Number {
    padZeroes(width: number, padChar?: string): string;
}

interface String {
    toDate(): Date;
}