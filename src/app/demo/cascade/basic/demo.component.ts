import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
    templateUrl: './demo.component.html'
})
export class CascadeBasicDemoComponent {
    constructor(public http: HttpClient) {
    }

    areas = require('../../../../mock-data/tree-data.json');

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
    summary: string = '以行政区选择作为场景，说明如何使用静态数据来实现级联数据的选择';
    description: string = '';
}

