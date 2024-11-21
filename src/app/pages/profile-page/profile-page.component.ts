import { Component, inject } from '@angular/core';
import { ProfileHeaderComponent } from "../../common-ui/profile-header/profile-header.component";
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { ImgUrlPipe } from "../../pipes/img-url.pipe";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileHeaderComponent, AsyncPipe, RouterLink, SvgIconComponent, ImgUrlPipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  profileService = inject(ProfileService)
  activateRoute = inject(ActivatedRoute)

  subscribers$ = this.profileService.getSubscribersShortList(5)

  user$ = toObservable(this.profileService.user)

  profile$ = this.activateRoute.params
    .pipe(
      switchMap(({id}) => {
        if (id === 'me') return this.user$

        return this.profileService.getAccount(id)
      })
    )
}
