import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = '';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  closeMe(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.closeMeEvent.emit();
  }
  confirm(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.confirmEvent.emit();
  } 
}
