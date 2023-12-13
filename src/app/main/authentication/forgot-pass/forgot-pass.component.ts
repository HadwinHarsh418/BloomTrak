import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public submitted1 = false;
  @ViewChild('otpConfirm') otpConfirm:ElementRef <any>;
  public otpFrm: FormGroup;
  loading1: boolean =false;

  constructor(
    private _formBuilder : FormBuilder,
    private _coreConfigService: CoreConfigService,
    private modalService : NgbModal,
    private dataService: DataService,
    private tost :ToastrManager,
    private rout : Router,
    private auth:AuthenticationService

  ) {
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
   }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      num: ['', [Validators.required]],
      // password: ['', Validators.compose([Validators.required])],
      user_role: ['3', [Validators.required]],
      // cnfmpassword: ['', Validators.compose([Validators.required])] },
      // { 
      //   validators: this.password.bind(this)
      // }
  });

  this.otpFrm = this._formBuilder.group({
    otp: ['', [Validators.required]],
   
});

  }

  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    let data ={
      username : this.loginForm.value.num,
      OTP : ''
    }
    this.loading = true;
     this.dataService.phoneNoverified(data).subscribe((res:any) => {
        if (!res.error) {
            this.tost.successToastr(res.msg)
           this.modalOpenOSE(this.otpConfirm,'md')
        }else{
          this.tost.errorToastr(res.msg)
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      }
      );
  }

  get f() {
    return this.loginForm.controls;
  }

  get ot() {
    return this.otpFrm.controls;
  }

  modalOpenOSE(modalOSE, size = 'sm') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }

  otpFrmSubmit(modal){
    this.submitted1 = true;
    // stop here if form is invalid
    if (this.otpFrm.invalid) {
      return;
    }
    let data ={
      username : this.loginForm.value.num,
      OTP : this.otpFrm.value.otp
    }
    this.loading1 = true;
     this.dataService.phoneNoverified(data).subscribe((res:any) => {
        if (!res.error) {
         this.auth.tempToken=res.body.token;
            this.tost.successToastr(res.msg)
            this.closed(modal)
            this.rout.navigateByUrl('resetPassword')
        }else{
          this.tost.errorToastr(res.msg)
        }
        this.loading1 = false;
      }, error => {
        this.loading1 = false;
      }
      );
  }
}
