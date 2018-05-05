import {Component} from "@angular/core";
import {CascadeDateGenerator} from "jigsaw/component/cascade/cascade";
import {ArrayCollection} from "jigsaw/core/data/array-collection";
import {HttpClient} from "@angular/common/http";

@Component({
    templateUrl: './demo.component.html'
})
export class CascadeMultipleDemoComponent {
    constructor(public http: HttpClient) {
    }

    selectedItems = [];
    selectedMessage: string;

    dataGenerator: CascadeDateGenerator = (selectedItem: any, selectedItems: any[], data: any[], level: number) => {
        const levelPram = this.getLevelPram(level);
        let list: any = this.http.get('queryCascadingData',
            {params: {level: level + '', parentID: selectedItem ? selectedItem[levelPram.filterKey] : null}});
        return {
            title: levelPram.title,
            noMore: levelPram.noMore,
            list: list
        };
    };

    getLevelPram(level: number): {filterKey: string, title: string, noMore?: boolean} {
        switch (level) {
            case 0:
                return {filterKey: null, title: '省'};
            case 1:
                return {filterKey: 'ProID', title: '市'};
            case 2:
                return {filterKey: 'CityID', title: '区', noMore: true}; // noMore:配置级联是否结束
        }
    }

    parseSelectedData(selectedData: any[]) {
        console.log(selectedData);
        this.selectedMessage = selectedData.reduce((str, item, index) => {
            if (item instanceof ArrayCollection || item instanceof Array) {
                item.forEach((it, idx) => {
                    str += `${it.name}` + (idx == item.length - 1 ? `` : ` ; `);
                })
            } else {
                str += `${item.name}` + (index == selectedData.length - 1 ? `` : ` | `);
            }
            return str;
        }, '');
    }

    // ====================================================================
    // ignore the following lines, they are not important to this demo
    // ====================================================================
    summary: string = '';
    description: string = '';
    tags: string[] = [
        'JigsawCascade'
    ];
}

