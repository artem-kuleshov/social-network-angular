import { Component, input } from '@angular/core';
import { IProfile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from "../../pipes/img-url.pipe";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  user = input<IProfile>()
}
