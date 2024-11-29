import { Component, Input } from '@angular/core';
import { IProfile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from "../../../pipes/img-url.pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [ImgUrlPipe, RouterLink],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile!: IProfile
}
