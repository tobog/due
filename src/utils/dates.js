
import { typeOf } from './tool'

export const compareEqual = function (date, type, compare = {}) {
    if (type === 'year') return date.year == compare.year;
    if (type === 'month') return date.year == compare.year && date.month == compare.month;
    if (type === 'day') return date.year == compare.year && date.month == compare.month && date.day == compare.day;
    return date[type] == compare[type];
};

export default class Dates extends Date {
    constructor(...arg) {
        super(...arg);
    }
    static New(date) {
        const type = typeOf(date);
        if (type === 'object') return new Date(`${date.year || 1917}-${date.month || 1}-${date.day || 1} ${date.hours || 0}:${date.minutes || 0}:${date.seconds || 0}`);
        return new Date(date || null);
    }
    static getTimes(date, clearhours) {
        if (!date) return 0;
        const type = typeOf(date);
        switch (type) {
            case 'string': {
                const times = Date.parse(date);
                return clearhours ? Math.floor(times / 3600 / 1000 / 24) * 3600 * 1000 * 24 : times;
            }
            case 'date': {
                const times = date.getTime();
                return clearhours ? Math.floor(times / 3600 / 1000 / 24) * 3600 * 1000 * 24 : times;
            }
            case 'object': {
                const hours = clearhours ? `00:00:00` : `${date.hours || 0}:${date.minutes || 0}:${date.seconds || 0}`;
                return Date.parse(`${date.year || 1917}-${date.month || 1}-${date.day || 1} ` + hours);
            }
            default: return date;
        }
    }
    static clearHours(time) {
        const cloneDate = new Date(time);
        cloneDate.setHours(0, 0, 0, 0);
        return cloneDate.getTime();
    }
    static formatTime(val) {
        val = parseInt(val);
        return val < 10 ? '0' + val : val;
    }
    static formatParse(date, format = "yy-MM-dd HH:mm:ss") {
        if (date && format) {
            const val = Dates.parseObj(date);
            if (val) return [val];
            const keymap = {
                y: 'year',
                M: 'month',
                d: 'day',
                H: 'hours',
                m: 'minutes',
                s: 'seconds',
            }, arr = [], objIndex = { y: 0, M: 0, d: 0, H: 0, m: 0, s: 0 };
            date = date.split(/\D+/i);
            const cells = format.split(/[^yMdHms0-9]+/i);
            cells.forEach((item, index) => {
                const key = item[0], count = objIndex[key], obj = arr[count] || {};
                if (count === void 0) return;
                objIndex[key] = count + 1;
                obj[keymap[key]] = date[index] || '00';
                arr[count] = obj;
            });
            return arr;
        }
    }
    static stringify(dates, format = "yy-MM-dd HH:mm:ss") {
        if (!dates) return dates;
        if (!Array.isArray(dates)) dates = [dates];
        const data = [];
        dates.forEach(function (item) {
            if (item && typeOf(item) !== 'object') {
                data.push(Dates.parseObj(item));
            } else {
                data.push(item);
            }
        })
        const objIndex = { y: 0, m: 0, d: 0, H: 0, M: 0, s: 0 };
        return format.replace(/(y|M|d|H|m|s)+/g, function (match, reg, offset, str) {
            let key = '';
            // console.log(...arguments)
            switch (reg) {
                case 'y': key = 'year'; break;
                case 'M': key = 'month'; break;
                case 'd': key = 'day'; break;
                case 'H': key = 'hours'; break;
                case 'm': key = 'minutes'; break;
                case 's': key = 'seconds'; break;
            }
            const index = objIndex[reg]++, value = data[index];
            return value ? (match.length > 1 ? Dates.formatTime(value[key]) : value[key]) : match;
        })
    }
    static parseObj(date) {
        if (!date) return date;
        const type = typeOf(date);
        if (type === 'object') return date;
        if (type === 'string' || type === 'number') {
            try {
                date = new Date(date);
            } catch (error) {
                return;
            }
        }
        const year = date.getFullYear();
        if (year !== year) return;
        return {
            year,
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            week: date.getDay(),
            time: date.getTime()
        }
    }
    static siblingMonth(src, diff) {
        const temp = new Date(src || null); // lets copy it so we don't change the original
        const newMonth = temp.getMonth() + diff + 1;
        return new Date(temp.getFullYear(), newMonth, 0);
    }
    static siblingDate(src, diff) {
        const time = new Date(src || null).getTime(); // lets copy it so we don't change the original;
        return new Date(time + diff * 3600 * 24 * 1000);
    }
    static formats(type) {
        switch (type) {
            case 'date': return 'yy-MM-dd';
            case 'daterange': return 'yy-MM-dd ~ yy-MM-dd';
            case 'datetime': return 'yy-MM-dd HH:mm:ss';
            case 'datetimerange': return 'yy-MM-dd HH:mm:ss ~ yy-MM-dd HH:mm:ss';
            case 'year': return 'yy';
            case 'month': return 'yy-MM';
            case 'times': return 'HH:mm:ss';
            case 'timesrange': return 'HH:mm:ss ~ HH:mm:ss';
            case 'hours': return 'HH:00';
            case 'hoursrange': return 'HH:00 ~ HH:00';
            default: return 'yy-MM-dd HH:mm:ss';
        }
    }

}