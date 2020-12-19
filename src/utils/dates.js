
import { typeOf } from './tool'
export const compareEqual = function (date, type, compare = {}) {
    if (type === 'year') {
        return date.year == compare.year;
    }
    if (type === 'month') {
        return date.year == compare.year && date.month == compare.month;
    }
    if (type === 'day') {
        return date.year == compare.year && date.month == compare.month && date.day == compare.day;
    }
    return date[type] == compare[type];
}

export  default class Dates extends Date {
    constructor() {
        super(...arguments);
    }
    static New(date) {
        const type = typeOf(date);
        if (type === 'object') return new Date(`${date.year || 1917}-${date.month || 1}-${date.day || 1} ${date.hours || 0}:${date.minutes || 0}:${date.seconds || 0}`);
        return new Date(date ||Date.now())
    }
    static getTimes(date, clearhours) {
        const type = typeOf(date);
        if (!date) return 0;
        switch (type) {
            case 'string': return Date.parse(date); break;
            case 'date': return date.getTime(); break;
            case 'object': {
                const hours = clearhours ? `00:00:00` : `${date.hours || 0}:${date.minutes || 0}:${date.seconds || 0}`;
                return Date.parse(`${date.year || 1917}-${date.month || 1}-${date.day || 1} ` + hours)
            }; break;
            default: return date;
        }
    }
    static clearHours (time) {
        const cloneDate = new Date(time);
        cloneDate.setHours(0, 0, 0, 0);
        return cloneDate.getTime();
    };
    static formatTime(val) {
        val = parseInt(val);
        return val < 10 ? '0' + val : val;
    }
    static formatParse(date, format = "yy-mm-dd HH:MM:SS") {
        if (date && format) {
            const val = Dates.parseObj(date);
            if (val) return [val];
            const keymap = {
                y: 'year',
                m: 'month',
                d: 'day',
                H: 'hours',
                M: 'minutes',
                S: 'seconds',
            }, arr = [], objIndex = { y: 0, m: 0, d: 0, H: 0, M: 0, S: 0 };
            date = date.split(/\D+/i);
            const cells=format.split(/[^ymdHMS0-9]+/i);
            cells.forEach((item, index) => {
                const key = item[0], count = objIndex[key], obj = arr[count] || {};
                if(count===undefined) return;
                objIndex[key] = count + 1;
                obj[keymap[key]] = date[index] || '00';
                arr[count] = obj;
            });
            return arr;
        }
    }
    static stringify(dates, format = "yy-mm-dd HH:MM:SS") {
        if (!dates) return dates;
        if (typeOf(dates) !== 'array') dates = [dates];
        const data=[];
        dates.forEach(function(item){
            if(item&&typeOf(item)!=='object'){
                data.push(Dates.parseObj(item));
            }else{
                data.push(item);
            }
        })
        const objIndex = { y: 0, m: 0, d: 0, H: 0, M: 0, S: 0 };
        return format.replace(/(y|m|d|H|M|S)+/g, function (match, reg, offset, str) {
            let key = '';
            switch (reg) {
                case 'y': key = 'year'; break;
                case 'm': key = 'month'; break;
                case 'd': key = 'day'; break;
                case 'H': key = 'hours'; break;
                case 'M': key = 'minutes'; break;
                case 'S': key = 'seconds'; break;
            }
            const index = objIndex[reg], value = data[index]; objIndex[reg] += 1;
            return value ? Dates.formatTime(value[key]) : match;
        })
    }
    static parseObj(date) {
        if (!date) return date;
        const type=typeOf(date);
        if (type === 'object') return date;
        if (type === 'string' || type=== 'number') {
            try {
                date = new Date(date);
            } catch (error) {
                return;
            }
        }
        const year = date.getFullYear();
        if (year !== year) return;
        return {
            year: date.getFullYear(),
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
        const temp = new Date(src || Date.now()); // lets copy it so we don't change the original
        const newMonth = temp.getMonth() + diff + 1;
        return new Date(temp.getFullYear(), newMonth, 0);
    }
    static siblingDate(src, diff) {
        const time = new Date(src || Date.now()).getTime(); // lets copy it so we don't change the original;
        return new Date(time+diff*3600*24*1000);
    }
    static formats(type) {
        switch (type) {
            case 'date': return 'yy-mm-dd'; break;
            case 'daterange': return 'yy-mm-dd ~ yy-mm-dd'; break;
            case 'datetime': return 'yy-mm-dd HH:MM:SS'; break;
            case 'datetimerange': return 'yy-mm-dd HH:MM:SS ~ yy-mm-dd HH:MM:SS'; break;
            case 'year': return 'yy'; break;
            case 'month': return 'yy-mm'; break;
            case 'times': return 'HH:MM:SS'; break;
            case 'timesrange': return 'HH:MM:SS ~ HH:MM:SS'; break;
            case 'hours': return 'HH:00'; break;
            case 'hoursrange': return 'HH:00 ~ HH:00'; break;
            default: return 'yy-mm-dd HH:MM:SS';
        }
    }

}