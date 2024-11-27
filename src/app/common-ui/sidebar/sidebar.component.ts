import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { SvgIconComponent } from "../svg-icon/svg-icon.component";
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, Subscription } from 'rxjs';
import { ImgUrlPipe } from "../../pipes/img-url.pipe";
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconComponent, SubscriberCardComponent, RouterLink, AsyncPipe, ImgUrlPipe, RouterLinkActive],
  templateUrl: './sidebar.component.html', 
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  profileService = inject(ProfileService)
  authService = inject(AuthService)
  modalService = inject(ModalService)

  subscribers$ = this.profileService.getSubscribersShortList()
  user = this.profileService.user

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef
  modalSubsctiption!: Subscription

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats' 
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

  logoutModalConfirm(event: MouseEvent) {
    // event.preventDefault()
    // event.stopPropagation()

    console.log(this.entry)

    this.modalSubsctiption = this.modalService.openModal(this.entry, 'Вы уверены, что хотите выйти из аккаунта?')
      .subscribe(res => {
        this.logout()
      })
  }

  logout() {
    firstValueFrom(this.authService.logout())
  }
}
