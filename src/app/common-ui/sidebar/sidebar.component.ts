import { Component, inject, signal } from '@angular/core';
import { SvgIconComponent } from "../svg-icon/svg-icon.component";
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { IProfile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from "../../pipes/img-url.pipe";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconComponent, SubscriberCardComponent, RouterLink, AsyncPipe, ImgUrlPipe],
  templateUrl: './sidebar.component.html', 
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  profileService = inject(ProfileService)

  subscribers$ = this.profileService.getSubscribersShortList()
  user = this.profileService.user

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: ''
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats2' 
    },
    { 
      label: 'Поиск', 
      icon: 'search', 
      link: 'search'
    }
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}
