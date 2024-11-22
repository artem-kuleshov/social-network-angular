import { Component, effect, inject, ViewChild } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, firstValueFrom } from 'rxjs';
import { InputComponent } from "../../common-ui/form-elemnts/input.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, InputComponent, NgIf, AvatarUploadComponent, ImgUrlPipe, AsyncPipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  profileService = inject(ProfileService)
  user = this.profileService.user
  user$ = toObservable(this.profileService.user)

  @ViewChild(AvatarUploadComponent) avatarUploadComponent: AvatarUploadComponent | undefined

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

    if (this.form.invalid) return

    if (this.avatarUploadComponent?.avatar) {
      this.profileService.uploadPhoto(this.avatarUploadComponent.avatar)
        .subscribe(res => {
          // TODO Не обновляется аватар на сранице настроек
          this.profileService.user.set(res)
        })
    }

    //@ts-ignore
    this.profileService.updateProfile({
      ...this.form.value, 
      stack: this.splitStack(this.form.value.stack)
    }).subscribe(res => {
      this.profileService.user.set(res)
    })
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
