import { Component, effect, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, firstValueFrom } from 'rxjs';
import { InputComponent } from "../../common-ui/form-elemnts/input.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, InputComponent, NgIf],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  profileService = inject(ProfileService)
  user = this.profileService.user

  formBuilder = inject(FormBuilder)

  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.user(),
        stack: this.mergeStack(this.user()?.stack)
      })
    })
  }

  onSave() {
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()

    console.log(this.form.getError('lastName'))
    if (this.form.invalid) return

    //@ts-ignore
    firstValueFrom(this.profileService.updateProfile({
      ...this.form.value, 
      stack: this.splitStack(this.form.value.stack)
    }))
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return ['']
    if (Array.isArray(stack)) return []

    return stack.split(',')
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return ''
    if (Array.isArray(stack)) return stack.join(',')

    return stack
  }
}
