import { Pipe, PipeTransform } from '@angular/core';
import { API_URL } from '../app.constants';

@Pipe({
  name: 'imgUrl',
  standalone: true
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) return '/assets/images/noavatar.jpg';
    return `${API_URL}/${value}`;
  }

}
