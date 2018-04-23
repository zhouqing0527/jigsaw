import {Component, OnInit} from "@angular/core";
import {CascadeDateGenerator} from "jigsaw/component/cascade/cascade";
import {ArrayCollection} from "jigsaw/core/data/array-collection";
import {HttpClient} from "@angular/common/http";

@Component({
    templateUrl: './demo.component.html'
})
export class CascadeDataFillBackDemoComponent implements OnInit {
    constructor(public http: HttpClient) {
    }

    selectedItems = [
        {"ProID": 1, "name": "北京市", "ProSort": 1, "ProRemark": "直辖市"},
        {"CityID": 1, "name": "北京市", "ProID": 1, "CitySort": 1},
        {"Id": 2, "name": "西城区", "CityID": 1, "DisSort": null}
    ];
    selectedMessage: string;

    dataGenerator: CascadeDateGenerator = (selectedItem: any, selectedItems: any[], data: any[], level: number) => {
        const levelPram = this.getLevelPram(level);
        let list: any = this.http.get('queryCascadingData',
            {params: {level: level + '', parentID: selectedItem ? selectedItem[levelPram.filterKey] : null}});
        return {
            title: levelPram.title,
            cascadingOver: levelPram.cascadingOver,
            list: list
        };
    };

    getLevelPram(level: number): {filterKey: string, title: string, cascadingOver?: boolean} {
        switch (level) {
            case 0:
                return {filterKey: null, title: '省'};
            case 1:
                return {filterKey: 'ProID', title: '市'};
            case 2:
                return {filterKey: 'CityID', title: '区', cascadingOver: true}; // cascadingOver:配置级联是否结束
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

    ngOnInit() {
        this.parseSelectedData(this.selectedItems);
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

