import { Component, Input } from '@angular/core';
import { ModalConfig } from '../../interfaces/modal-config';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input({ required: true }) public icon!: string;
  @Input({ required: false }) public onClose?: () => void;

  public doNothing(): void {
    return;
  }
}
