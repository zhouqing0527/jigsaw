import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CascadeData} from "jigsaw/component/cascade/cascade";
import {AjaxInterceptor} from "../../../app.interceptor";

@Component({
    templateUrl: './demo.component.html'
})
export class CascadeLazyLoadDemoComponent {
    constructor(public http: HttpClient) {
    }

    levelInfos = [
        {title: '省/直辖市', labelField: 'province', idField: 'provinceId'},
        {title: '市', labelField: 'city', idField: 'cityId'},
        {title: '区', labelField: 'district', idField: 'districtId'},
    ];
    generator(selectedItem: any, selectedItems: any[], data: any[], level: number): CascadeData {
        const params = {};
        selectedItems.forEach((si, idx) => {
            const field = this.levelInfos[idx].idField;
            params[field] = si[field];
        });
        const levelInfo = this.levelInfos[level];
        return {
            title: levelInfo.title,
            list: this.http.get('/cascade/area-data', {params: params})
                .map((dataTable: any[]) => {
                    dataTable.forEach(area =>area.label = area[levelInfo.labelField]);
                    return dataTable;
                }),
            noMore: level >= 2
        }
    }

    message: string = '--';

    parseMessage(selectedItems) {
        this.message = selectedItems.reduce((result, item) => {
            result.push(item.label);
            return result;
        }, []).join(' | ');
    }

    // ====================================================================
    // ignore the following lines, they are not important to this demo
    // ====================================================================
    summary: string = '';
    description: string = '';
}

// 模拟服务端逻辑，可以无视，一般下面这些逻辑在服务端是用sql实现的
AjaxInterceptor.registerProcessor(/\/cascade\/area-data.*/, req => {
    let table = require('../../../../mock-data/area-data.json');
    if (req.params.get('cityId')) {
        // 获取该城市的所有区
        return table.filter(area => area.cityId == req.params.get('cityId'));
    } else if (req.params.get('provinceId')) {
        // 获取该省的所有城市
        const cities = [];
        table.forEach(area => {
            if (area.provinceId != req.params.get('provinceId')) {
                return;
            }
            if (cities.find(city => city.cityId == area.cityId)) {
                return;
            }
            cities.push(area);
        });
        return cities;
    } else {
        // 获取所有省
        const provinces = [];
        table.forEach(area => {
            if (provinces.find(province => province.provinceId == area.provinceId)) {
                return;
            }
            provinces.push(area);
        });
        return provinces;
    }
});
