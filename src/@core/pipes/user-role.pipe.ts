import { Pipe, PipeTransform } from '@angular/core';
import { Role } from 'app/auth/models';


@Pipe({
	name: 'userrole'
})
export class UserRolePipe implements PipeTransform {

	constructor() { }
	transform(value: any) {
        let role = Role.Community;
        let o = parseInt(value);
        switch(o) {
            case 4: role =  Role.Admin;  break;
            default : role =  Role.Community; break;
          }
		return role;
	}

}