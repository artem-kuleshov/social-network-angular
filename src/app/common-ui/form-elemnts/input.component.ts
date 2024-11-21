import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="form-label">
        <span class="form-label__text regular">{{ labelText }}</span>
        <input [formControlName]="formControlName" class="form-input medium-text" type="text">
    </label>
  `,
})
export class InputComponent {
  @Input() labelText = 'Поле'
  @Input() formControlName = ''
}
