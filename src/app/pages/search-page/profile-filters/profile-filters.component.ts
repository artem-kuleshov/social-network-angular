import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../../common-ui/form-elemnts/input.component";
import { ProfileService } from '../../../data/services/profile.service';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  profileService = inject(ProfileService)
  formBuilder = inject(FormBuilder)

  searchForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  })

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        switchMap(formValue => {
          return this.profileService.searchAccounts(formValue)
        }),
        takeUntilDestroyed()
      )
      .subscribe()
  }
}