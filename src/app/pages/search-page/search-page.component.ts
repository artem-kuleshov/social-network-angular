import { Component, inject } from '@angular/core';
import { IProfile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  profileService = inject(ProfileService)
  profiles: IProfile[] = [] 
  
  constructor() {
    this.profileService.getTestAccounts()
      .subscribe(val => {
        this.profiles = val
      })
  }
}
