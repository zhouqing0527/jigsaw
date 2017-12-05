import {Component} from "@angular/core";

@Component({
    templateUrl: './app.component.html'
})
export class ButtonWithLoadingComponent {
    isLoading = false;
    label: string = 'click to load';

    onClick() {
        this.isLoading = !this.isLoading;
        this.label = this.isLoading ? 'loading...' : 'click to load';
    }

    // ====================================================================
    // ignore the following lines, they are not important to this demo
    // ====================================================================
    summary: string = '';
    description: string = '';
}

