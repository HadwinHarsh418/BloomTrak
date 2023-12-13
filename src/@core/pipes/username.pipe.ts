import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/auth/models';

@Pipe({
  name: 'username'
})
export class GetUsernamePipe implements PipeTransform {
  transform(value: User): any {
    return (!value) ? '' 
            : (value.firstName || value.lastName) 
            ? `${value.firstName} ${value.lastName}`
            : value.username;
  }
}
