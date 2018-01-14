import { TestBed, inject } from '@angular/core/testing';

import { addExtensions } from './extensions';

describe('extensions', () => {
    beforeEach(() => {
        addExtensions();

        TestBed.configureTestingModule({
            providers: []
        });
    });

    const dateNoTime = '01/01/1906';
    const dateWithTime = '1906-01-01T03:24:00';

    it('Date should compare short date', inject([], () => {
        const date1 = new Date(dateNoTime);
        const date2 = new Date();
        expect(date1.compareShortDate(date2)).toBeLessThan(0);
        expect(date1.compareShortDate(date1)).toEqual(0);
    }));

    it('Date should compare short date ignoring time', inject([], () => {
        const date1 = new Date(dateNoTime);
        const date2 = new Date(dateWithTime);
        expect(date1.compareShortDate(date2)).toEqual(0);
        expect(date1.compareShortDate(new Date())).toBeLessThan(0);
    }));

    it('Date should compare short date equality', inject([], () => {
        const date1 = new Date(dateNoTime);
        const date2 = new Date(dateWithTime);
        expect(date1.isShortDateEqual(date2)).toBeTruthy();
        expect(date1.isShortDateEqual(new Date())).toBeFalsy();
    }));

    it('Date should compare short date greater', inject([], () => {
        const date1 = new Date(dateNoTime);
        const date2 = new Date();
        expect(date1.isShortDateGreater(date2)).toBeFalsy();
        expect(date2.isShortDateGreater(date1)).toBeTruthy();
        expect(date1.isShortDateGreater(new Date(dateWithTime))).toBeFalsy();
    }));

    it('Date should compare short date greater equal', inject([], () => {
        const date1 = new Date(dateNoTime);
        const date2 = new Date();
        expect(date1.isShortDateGreaterEqual(date2)).toBeFalsy();
        expect(date2.isShortDateGreaterEqual(date1)).toBeTruthy();
        expect(date1.isShortDateGreaterEqual(new Date(dateWithTime))).toBeTruthy();
    }));

    it('Date should provide first of the month string', inject([], () => {
        expect(new Date('12/07/1961').toFirstOfTheMonthString()).toEqual('12/01/1961');
        expect(new Date('1/9/1961').toFirstOfTheMonthString()).toEqual('01/01/1961');
    }));

    it('Date should provide short date string (no time)', inject([], () => {
        expect(new Date(dateWithTime).toShortDateString()).toEqual(dateNoTime);
    }));


    it('Number should validate number', inject([], () => {
        expect((1).isValidNumber()).toBeTruthy();
        expect(Number.NaN.isValidNumber()).toBeFalsy();

        const oneByZero: number = 1.0 / 0.0;
        expect(isFinite(oneByZero)).toBeFalsy();
        expect(isNaN(oneByZero)).toBeFalsy();
        expect(oneByZero.isValidNumber()).toBeFalsy();

        const zeroByZero: number = 0.0 / 0.0;
        expect(isFinite(zeroByZero)).toBeFalsy();
        expect(isNaN(zeroByZero)).toBeTruthy();
        expect(zeroByZero.isValidNumber()).toBeFalsy();
    }));

    it('Number should provide string padded with zeros', inject([], () => {
        expect((1).padZeroes(3)).toEqual('001');
    }));

    it('Number should provide string padded with padChar', inject([], () => {
        expect((1).padZeroes(3, '~')).toEqual('~~1');
    }));


    it('String should validate date string', inject([], () => {
        expect('1/1/1'.isValidDate()).toBeTruthy();
        expect(dateNoTime.isValidDate()).toBeTruthy();
        expect(dateWithTime.isValidDate()).toBeTruthy();
        expect('not a date'.isValidDate()).toBeFalsy();
    }));

    it('String should provide Date from string', inject([], () => {
        expect(dateNoTime.toDate()).toBeTruthy();
        expect(dateNoTime.toDate()).toEqual(new Date(dateNoTime));
        expect(dateWithTime.toDate()).toEqual(new Date(dateWithTime));
    }));
});
