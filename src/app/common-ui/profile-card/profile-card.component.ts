import { Component, Input } from '@angular/core';
import { ProfileInterface } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from "../../pipes/img-url.pipe"; 

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: ProfileInterface;
}
