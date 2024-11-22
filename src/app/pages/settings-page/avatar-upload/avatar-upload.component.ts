import { Component, Input, signal } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { DragAndDropDirective } from '../../../common-ui/directives/drag-and-drop.directive';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DragAndDropDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  @Input({required: true}) avatarUrl: string = ''
  preview = signal<string>(this.avatarUrl)

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
