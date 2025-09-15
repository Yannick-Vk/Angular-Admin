import {Component, input, InputSignal} from '@angular/core';

@Component({
    selector: 'app-table',
    imports: [],
    templateUrl: './table.html',
    styleUrl: './table.scss'
})
export class Table {
    headers: InputSignal<string[]> = input.required<string[]>();
}
