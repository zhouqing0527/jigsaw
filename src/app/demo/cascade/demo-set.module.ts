import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CascadeBasicDemoComponent} from "./basic/demo.component";
import {CascadeBasicDemoModule} from "./basic/demo.module";
import {CascadeLazyLoadDemoComponent} from "./lazy-load/demo.component";
import {CascadeLazyLoadDemoModule} from "./lazy-load/demo.module";
import {CascadeMultipleDemoComponent} from "./multiple-select/demo.component";
import {CascadeMultipleDemoModule} from "./multiple-select/demo.module";
import {CascadeDataFillBackDemoComponent} from "./preset-data/demo.component";
import {CascadeDataFillBackDemoModule} from "./preset-data/demo.module";
import {CascadeMultiDataFillBackDemoComponent} from "app/demo/cascade/preset-multi-data/demo.component";
import {CascadeMultiDataFillBackDemoModule} from "./preset-multi-data/demo.module";
import {CascadeMultiDimensionalDemoComponent} from "./multi-dimensional-select/demo.component";
import {CascadeMultiDimensionalDemoModule} from "./multi-dimensional-select/demo.module";
import {CascadeMultiDimensionalFillBackDemoComponent} from "./preset-multi-dimensional-data/demo.component";
import {CascadeMultiDimensionalFillBackDemoModule} from "./preset-multi-dimensional-data/demo.module";
import {CascadeShowAllDemoComponent} from "./show-all/demo.component";
import {CascadeShowAllDemoModule} from "./show-all/demo.module";

export const routerConfig = [
    {
        path: 'basic', component: CascadeBasicDemoComponent
    },
    {
        path: 'lazy-load', component: CascadeLazyLoadDemoComponent
    },
    {
        path: 'multiple-select', component: CascadeMultipleDemoComponent
    },
    {
        path: 'preset-data', component: CascadeDataFillBackDemoComponent
    },
    {
        path: 'preset-multi-data', component: CascadeMultiDataFillBackDemoComponent
    },
    {
        path: 'multi-dimensional-select', component: CascadeMultiDimensionalDemoComponent
    },
    {
        path: 'preset-multi-dimensional-data', component: CascadeMultiDimensionalFillBackDemoComponent
    },
    {
        path: 'show-all', component: CascadeShowAllDemoComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routerConfig),
        CascadeBasicDemoModule,
        CascadeLazyLoadDemoModule,
        CascadeMultipleDemoModule,
        CascadeDataFillBackDemoModule,
        CascadeMultiDataFillBackDemoModule,
        CascadeMultiDimensionalDemoModule,
        CascadeMultiDimensionalFillBackDemoModule,
        CascadeShowAllDemoModule
    ]
})
export class CascadeDemoModule {

}
