export function addExtensions() {

    Date.prototype.compareShortDate = function (date2: Date): number {
        let rc = this.getFullYear() - date2.getFullYear();

        if (!rc) {
            rc = this.getMonth() - date2.getMonth();
        }

        if (!rc) {
            rc = this.getDate() - date2.getDate();
        }

        return rc;
    };

    Date.prototype.isShortDateEqual = function (date2: Date): boolean {
        const rc = this.compareShortDate(date2);
        return rc === 0;
    };

    Date.prototype.isShortDateGreater = function (date2: Date): boolean {
        const rc = this.compareShortDate(date2);
        return rc > 0;
    };

    Date.prototype.isShortDateGreaterEqual = function (date2: Date): boolean {
        const rc = this.compareShortDate(date2);
        return rc >= 0;
    };

    Date.prototype.toFirstOfTheMonthString = function (): string {
        return `${(this.getMonth() + 1).padZeroes(2)}/01/${this.getFullYear()}`;
    };

    Date.prototype.toShortDateString = function (): string {
        return `${(this.getMonth() + 1).padZeroes(2)}/${this.getDate().padZeroes(2)}/${this.getFullYear()}`;
    };

    Number.prototype.padZeroes = function (width: number, padChar?: string): string {
        padChar = typeof padChar !== 'undefined' ? padChar : '0';
        const pad = new Array(1 + width).join(padChar);
        return (pad + this).slice(-pad.length);
    };

    String.prototype.toDate = function (): Date {
        return new Date(this);
    };
}
