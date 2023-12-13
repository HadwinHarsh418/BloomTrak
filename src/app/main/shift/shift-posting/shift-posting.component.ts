import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-shift-posting',
  templateUrl: './shift-posting.component.html',
  styleUrls: ['./shift-posting.component.scss']
})
export class ShiftPostingComponent implements OnInit {
  public contentHeader: object;
  formData: FormGroup;
  btnShow: boolean = false;
  userId: any;
  loading: boolean;
  curComDetails: any;
  error: any;

  constructor(private fb: FormBuilder,
    private aCtRoute: ActivatedRoute,
    private _userService: UserService,
    private auth: AuthenticationService,
    private toastr: ToastrManager,) { }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Shift-Posting',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [

          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shift',
            isLink: true,
            link: '/shift'
          },
          // {
          //   name: 'User profile',
          //   isLink: false
          // }
        ]
      }
    };

    this.formData = this.fb.group({
      shift_Types: [''],
      employee_Types: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
    })

    // this.forgotPassword = this.fb.group({
    //   password: ['', Validators.required],
    //   confPassword: ['', [Validators.required]],
    //   newPassword: ['', [Validators.required]],
    //   id: this.userId
    // })
  }

  get controls() {
    return this.formData.controls;
  }
  // get fp() {
  //   return this.forgotPassword.controls;
  // }
}


