import {Component} from "@angular/core";
import {CascadeDateGenerator} from "jigsaw/component/cascade/cascade";
import {HttpClient} from "@angular/common/http";

@Component({
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.css']
})
export class CascadeMultiDimensionalDemoComponent {
    constructor(public http: HttpClient) {
    }

    selectedItems = [];

    selectedArea = [];

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

    selectedDataChange(selectedData: any[]) {
        console.log(selectedData);
        this.selectedArea = selectedData[selectedData.length - 1];
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

