import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <ng-container [formGroup]="formGroupParent">
      <label class="form-label">
          <span class="form-label__text regular">{{ labelText }}</span>
          <input [formControlName]="controlName" class="form-input medium-text" type="text">
      </label>
  </ng-container>
  `,
})
export class InputComponent {
  @Input({required: true}) formGroupParent!: FormGroup<any>;
  @Input({required: true}) controlName: string = ''
  @Input() labelText: string = 'Поле'
}
