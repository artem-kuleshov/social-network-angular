import { Component, inject, Input, signal, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { DragAndDropDirective } from '../../../common-ui/directives/drag-and-drop.directive';
import { ModalComponent } from '../../../common-ui/modal/modal.component';
import { firstValueFrom, Subscription } from 'rxjs';
import { ModalService } from '../../../common-ui/services/modal.service';
import { ProfileService } from '../../../data/services/profile.service';
import { ImgUrlPipe } from "../../../pipes/img-url.pipe";

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DragAndDropDirective, ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {  
  @Input({required: true}) avatarUrl: string | null = ''

  profileService = inject(ProfileService)
  modalService = inject(ModalService)

  preview = signal<string|null>(null)

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef
  modalSubsctiption!: Subscription

  user = this.profileService.user
  avatar: File | null = null

  ngOnInit() {
    this.preview.set(this.avatarUrl)
  }

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    this.loadFile(file)
    }

  onFileDropped(file: File) {
    this.loadFile(file)
  }

  createModalRemoveAvatar(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.modalSubsctiption = this.modalService.openModal(this.entry, 'Вы уверены, что хотите удалить аватарку?')
      .subscribe(async (res) => {
        const user = await firstValueFrom(this.profileService.deleteAvatar())
        this.user.set(user)
        this.preview.set(null)
      })
  }

  clickBtnDeleteAvatar(event: MouseEvent) {
    event.preventDefault()
    console.log(event)
  }

  loadFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return

    const reader = new FileReader()
    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }

    reader.readAsDataURL(file)
    this.avatar = file
  }
}
