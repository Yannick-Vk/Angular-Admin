import {ChangeDetectionStrategy, Component, signal} from '@angular/core';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [],
    templateUrl: './modal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Modal {
    title = signal<string>('');
    message = signal<string>('');

    isOpen = signal(false);

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
    }
}
