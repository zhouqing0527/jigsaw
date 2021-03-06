import {NgModule} from '@angular/core';
import {JigsawTableModule} from "jigsaw/component/table/table";
import {JigsawSliderModule} from "jigsaw/component/slider/index";
import {JigsawViewportModule} from "jigsaw/component/viewport/viewport";
import {JigsawDemoDescriptionModule} from "app/demo-description/demo-description";
import {BigColumnDemoComponent} from './demo.component';

@NgModule({
    imports: [
        JigsawTableModule, JigsawSliderModule, JigsawDemoDescriptionModule, JigsawViewportModule
    ],
    declarations: [
        BigColumnDemoComponent,
    ],
    exports: [BigColumnDemoComponent],
})
export class BigColumnDemoModule {
}
