import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {
  public resetPassForm: FormGroup;
  public loading = false;
  restTkn: any;

  constructor(
    private _formBuilder : FormBuilder,
    private _coreConfigService: CoreConfigService,
    private dataService: DataService,
    private tost :ToastrManager,
    private rout : Router,
    private _authenticationService : AuthenticationService
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
    this.resetPassForm = this._formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      cnfrmpassword:  ['',Validators.required ]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )
  }

  get controls(){
    return  this.resetPassForm.controls
  }

  onSubmit(){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.resetPassForm.invalid) {
      return;
    }

    let data ={
      password : this.resetPassForm.value.password,
      confirmPswd : this.resetPassForm.value.cnfrmpassword,
    }
    this.loading = true;
    this.dataService.forgotPassword(data).subscribe((res:any) => {
      if (!res.error) {
      
          this.tost.successToastr(res.msg)
          this.rout.navigateByUrl('/')
      }else{
        this.tost.errorToastr(res.msg)
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    }
    );
  }
}
