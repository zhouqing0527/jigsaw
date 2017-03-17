import { Injectable } from '@angular/core';

let moment = require('moment');

@Injectable()
export class TimeService{

    constructor() {
        moment.locale('zh-cn');
    }

    /*
    *
    * 获取时间，支持时间宏，格式化
    * @param 时间（时间宏，时间字符串，Date对象） 粒度
    *
    * */
    getDate(timeMacro, gr) {
        if (typeof timeMacro === 'string') {
            var isLetter = /^[a-z]/i;
            if (isLetter.test(timeMacro)) {
                timeMacro = timeMacro.replace(/\s+/g, "");
                var fullPara = /([a-z]+)(\+|\-)?([\d]+)([a-z]+)?/i;
                var timeMacroArr = fullPara.exec(timeMacro);
                if (timeMacroArr && timeMacroArr[2] != undefined) { //有加减 now-2d
                    var result = null;
                    if(timeMacroArr[2] == "+"){
                        result = this.formatWithGr(this.addDate(this._timeMacroConvert(timeMacroArr[1]), timeMacroArr[3],  timeMacroArr[4]), gr);
                    }
                    else if(timeMacroArr[2] == "-"){
                        result = this.formatWithGr(this.subtractDate(this._timeMacroConvert(timeMacroArr[1]), timeMacroArr[3],  timeMacroArr[4]), gr);
                    }
                    return result;
                } else { //无加减 now
                    return this.formatWithGr(this._timeMacroConvert(timeMacro), gr);
                }
            } else { //时间字符串 2017-03-10, 12:00:00
                return this.formatWithGr(timeMacro, gr);
            }
        } else { //Date对象
            return this.formatWithGr(timeMacro, gr);
        }
    }

    _timeMacroConvert(timeMacro) {
        var date;
        switch (timeMacro) {
            case 'now':
                date = new Date();
                break;
            default:
                date = timeMacro;
                break;
        }
        return date;
    }


    /*
    *
    * 格式化时间
    * @param 时间 时间格式
    *
    * */
    format(date, formator){
        return moment(date).format(formator);
    }

    /*
     *
     * 格式化时间
     * @param 时间 粒度
     *
     * */
    formatWithGr(date, gr): string {
        return moment(date).format(this.getFormator(gr));
    }

    /*
     *
     * 时间加法
     * @param 时间 数值 单位
     *
     * */
    addDate(date, num, unit){
        return moment(date).add(num, unit);
    }

    /*
     *
     * 时间减法
     * @param 时间 数值 单位
     *
     * */
    subtractDate(date, num, unit){
        return moment(date).subtract(num, unit);
    }

    /*
     *
     * 获取时间格式
     * @param 粒度
     *
     * */
    getFormator(gr){
        let format: string;
        switch(gr){
            case 'quarter':
                format = 'YYYY-Q';
                break;
            case 'month':
                format = 'YYYY-MM';
                break;
            case 'week':
                format = 'YYYY-W';
                break;
            case 'day':
                format =  'YYYY-MM-DD';
                break;
            case 'hour':
                format = 'YYYY-MM-DD, HH';
                break;
            case 'minute':
                format = 'YYYY-MM-DD, HH:mm';
                break;
            case 'second':
                format = 'YYYY-MM-DD, HH:mm:ss';
                break;
            default:
                format = 'YYYY-MM-DD, HH:mm:ss';
        }
        return format;
    }

}