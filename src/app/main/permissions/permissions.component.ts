import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})

export class PermissionsComponent implements OnInit {
  isChecked:any='Check All';
  isChecked1:any='Check All';

  permissionBox: any[] = [
    { name: 'View', value: 'view', checked: false, subTitle:'View Records Permission', className:'fa fa-eye' },
    { name: 'Update', value: 'update', checked: false, subTitle:'Update Records Permission', className:'fa fa-pencil' },
    { name: 'Delete', value: 'delete', checked: false, subTitle:'Delete Records Permission', className:'fa fa-trash' },
    { name: 'Add', value: 'add', checked: false, subTitle:'Add New Records Permission', className:'fa fa-plus' },
    { name: 'upload', value: 'upload', checked: false, subTitle:'upload New Records Permission', className:'fa fa-plus' },
    { name: 'Assign', value: 'assign', checked: false, subTitle:'Assign New Records Permission', className:'fa fa-plus' },
    { name: 'Assign Resident Count', value: 'assign resident count', checked: false, subTitle:'Assign Resident Count New Records Permission', className:'fa fa-plus' },
    { name: 'Apply', value: 'apply', checked: false, subTitle:'Apply New Records Permission', className:'fa fa-plus' },
    { name: 'Accept', value: 'accept', checked: false, subTitle:'Accept New Records Permission', className:'fa fa-plus' },
    { name: 'Post', value: 'post', checked: false, subTitle:'Post New Records Permission', className:'fa fa-plus' },
    { name: 'Run', value: 'run', checked: false, subTitle:'Run New Records Permission', className:'fa fa-plus' },
  ]
  roleData: any=[];
  permissionData:any=[];
  pageId: any;
  roleId: any;
  IsView: any="0";
  IsUpdate: any="0";
  IsDelete: any="0";
  IsAdd: any="0";
  permData: any;
  currentUser: import("../../auth/models/user").User;
  deptList: any;
  IsDepartment:boolean=false;
  alldeptList: any;
  roleData1: any = [];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  fileToUpload: any;
  allCommunity: any;
  comId: any;
  colDefine: string;
  usrRlNo: any;
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService: AuthenticationService,

  ) { 
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
        if(this.currentUser.prmsnId == '6'){
          this.getCommunityId()
          this.handleChange(this.currentUser.prmsnId == '6' ? '1' : this.currentUser.prmsnId)
          this.colDefine = 'col-md-3'
        }else{
          this.colDefine = 'col-md-4'
        }
      }
      );
      this.getRole()
      this.getPrmsnData()
  }

  ngOnInit(): void {
    this.getDepartment(35)
  }
  
  CheckAllOptions() {
    if (this.permissionBox.every(val => val.checked == true)){
      this.permissionBox.forEach(val => { val.checked = false });
      this.isChecked='Check All';
    }
    else{
      this.permissionBox.forEach(val => { val.checked = true });
      this.isChecked='UnCheck All'
    }
  }
  CheckAllOptions1(){
    if (this.deptList?.every(val => val.checked == true)){
      this.deptList?.forEach(val => { val.checked = false });
      this.isChecked='Check All';
    }
    else{
      this.deptList?.forEach(val => { val.checked = true });
      this.isChecked='UnCheck All'
    }
  }
  onChange1(val:any){
   this.roleId=val;
   this.chngMenu()
  }

  chngMenu(){
    let data = {
      is_for : this.roleId == 2 ? 'agency' : this.roleId == 1  ? 'community' : this.roleId == 21  ? 'community' : this.roleId == 4 ? 'user' : this.roleId == 5  ? 'user' : this.roleId == 18  ? 'user' : 'superadmin'
    }
    this.dataSrv.getPermission(data).subscribe((res:any)=>{
      if(!res.err){
        this.permissionData=res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster();
    })
  }

  onMenuChange(val:any){
     this.pageId=val;
     if(val==35){
       this.IsDepartment=true;
       this.getDepartment(val)
      }
      else{
        this.IsDepartment=false;
        
      }
      this.getPermissionById(); 
    }

  getPermissionById(){
    this.dataSrv.getPermissionById(this.pageId,this.roleId).subscribe((res:any)=>{
      if(!res.err){
         if(res.body[0]){
          this.permData=[[]]
          this.permData=res.body[0];
          if(this.permData.row_data){
             let deptList=JSON.parse(this.permData.row_data)
            //  console.log(this.deptList)
            //  console.log(deptList)
             this.deptList?.map( array1Ttem => {
              deptList.forEach( array2Item => {
                 if(array1Ttem.id == array2Item.id){
                    array1Ttem.checked=true;
                }
                else{
                  //  console.log("This item not present in array =>",array1Ttem);
                }
                return array1Ttem;
              })
            })
            
          }

          if(this.permData.add_permission == 0){
            this.permissionBox.find(item => item.value == "add").checked = false;
           }
           if(this.permData.delete_permission == 0){
            this.permissionBox.find(item => item.value == "delete").checked = false;
           }
           if(this.permData.edit_permission == 0){
            this.permissionBox.find(item => item.value == "update").checked = false;
           }
           if(this.permData.view_permission == 0){
             this.permissionBox.find(item => item.value == "view").checked = false;
            }
            if(this.permData.accept_permission == 0){
             this.permissionBox.find(item => item.value == "accept").checked = false;
            }
            if(this.permData.apply_permission == 0){
             this.permissionBox.find(item => item.value == "apply").checked = false;
            }
            if(this.permData.assign_permission == 0){
             this.permissionBox.find(item => item.value == "assign").checked = false;
            }
            if(this.permData.assignResidentCount_permission == 0){
             this.permissionBox.find(item => item.value == "assign resident count").checked = false;
            }
            if(this.permData.post_permission == 0){
             this.permissionBox.find(item => item.value == "post").checked = false;
            }
            if(this.permData.run_permission == 0){
             this.permissionBox.find(item => item.value == "run").checked = false;
            }
            if(this.permData.upload_permission == 0){
             this.permissionBox.find(item => item.value == "upload").checked = false;
            }

          if(this.permData.add_permission == 1){
           this.permissionBox.find(item => item.value == "add").checked = true;
          }
          if(this.permData.delete_permission == 1){
           this.permissionBox.find(item => item.value == "delete").checked = true;
          }
          if(this.permData.edit_permission == 1){
           this.permissionBox.find(item => item.value == "update").checked = true;
          }
          if(this.permData.view_permission == 1){
            this.permissionBox.find(item => item.value == "view").checked = true;
           }
           if(this.permData.accept_permission == 1){
            this.permissionBox.find(item => item.value == "accept").checked = true;
           }
           if(this.permData.apply_permission == 1){
            this.permissionBox.find(item => item.value == "apply").checked = true;
           }
           if(this.permData.assign_permission == 1){
            this.permissionBox.find(item => item.value == "assign").checked = true;
           }
           if(this.permData.assignResidentCount_permission == 1){
            this.permissionBox.find(item => item.value == "assign resident count").checked = true;
           }
           if(this.permData.post_permission == 1){
            this.permissionBox.find(item => item.value == "post").checked = true;
           }
           if(this.permData.run_permission == 1){
            this.permissionBox.find(item => item.value == "run").checked = true;
           }
           if(this.permData.upload_permission == 1){
            this.permissionBox.find(item => item.value == "upload").checked = true;
           }
          }
         else{
          this.permissionBox.map(element => {
              element.checked=false;
              return element;
           });
         }
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })

  }
  updatePermissions(){
  //  console.log(this.pageId,this.roleId)
   if(this.pageId ==undefined){
    this.toaster.errorToastr("Please select Menu Page")
   }
   if(this.roleId ==undefined){
    this.toaster.errorToastr("Please select Role")
   }
   let post1=[];
      if(this.pageId=='35'){
       this.deptList.forEach(element => {
          if(element.checked==true){
              this.alldeptList.forEach(obj => {
                // console.log(element.id,"==",obj.id)
                if(obj.id==element.id){
                  // console.log(obj)
                    if (!post1.find(o => o.id === obj.id))
                          post1.push(obj)
                     }
            });
          }
      });
      // console.log(post1)
   }
   const input_data={
      page_id:this.pageId,
      role_id:this.roleId,
      add_permission:'0',
      edit_permission: '0',
      delete_permission: '0',
      view_permission:'0',
      upload_permission:'0',
      run_permission:'0',
      post_permission:'0',
      assign_permission:'0',
      assignResidentCount_permission:'0',
      apply_permission:'0',
      accept_permission:'0',
      is_active: "1",
      row_data:post1
   }
    this.permissionBox.filter(item => item.checked).forEach(element => {
        switch (element.value) {
          case 'view':
            input_data.view_permission = '1'
            break;
          case 'add':
            input_data.add_permission = '1'
            break;
            case 'update':
              input_data.edit_permission = '1'
              break;
              case 'upload':
                input_data.upload_permission = '1'
                break;
                case 'assign':
                  input_data.assign_permission = '1'
                  break;
                  case 'assign resident count':
                  input_data.assignResidentCount_permission = '1'
                  break;
                  case 'apply':
                    input_data.apply_permission = '1'
                    break;
                    case 'accept':
                      input_data.accept_permission = '1'
                      break;
                      case 'post':
                        input_data.post_permission = '1'
                        break;
                        case 'run':
                          input_data.run_permission = '1'
                          break;
              case 'delete':
            input_data.delete_permission = '1'
            break;
        }
    });
    //  console.log(input_data)
     this.dataSrv.addPermissionToRole(input_data).subscribe((res:any)=>{
      if(!res.err){
        // console.log("addPermissionToRole------",res.body);
        if(res.msg=='Success'){
          this.toaster.successToastr("Permissions are Updated !!")
          this.getPermissionById();
        }
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })

  }


  checkValue(val : any){
    // console.log("valueSelected", val);
    if (this.permissionBox.every(val => val.checked == true)){
      this.isChecked='UnCheck All'
    }
    else{
      this.isChecked='Check All';
    }
  }
  departmentCheckValue(val){
    // console.log("valueSelected", val);
    if (this.deptList.every(val => val.checked == true)){
      this.isChecked1='UnCheck All'
    }
    else{
      this.isChecked1='Check All';
    }
  }


  getDepartment(val?){
    this.deptList=[];
    this.alldeptList=[];
     // let isfor = this.currentUser.prmsnId == '1' ? '6' : ''; this.currentUser.id,isfor
    //  this.dataSrv.getNewDepartment().subscribe((res:any)=>{
      let isfor =  6
      let for_other = null
     this.dataSrv.getDepartmentListing(this.currentUser.id,isfor,for_other).subscribe((res:any)=>{ 
      
      this.alldeptList=res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    });;
        res.body.forEach(element => {
           this.deptList.push({
            name:element.name,value:element.name, checked: false,id:element.id
           })
        });
        // console.log("Department Listing",this.deptList)

    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  slctCom(e){
    this.comId = e
    this.getRole();
    this.getDepartment()
  }

  getRole(){
    let id = this.currentUser.prmsnId
    let data = {
      prms : (this.usrRlNo == '1' || id == '1') ? 'community_id' : (this.usrRlNo == '2' || id == '2') ? 'agency_id' : 'agency_id',
       id : this.comId || this.currentUser.id
    }
    this.dataSrv.getRole(data).subscribe((res:any)=>{
      if(!res.err){
          this.roleData = res.body
          this.getAllRole()
              // this.roleData.map(i=>{
              //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
              //    this.roleData1.push(i)
              //  }
              // })
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  getAllRole(){
    this.dataSrv.getAllRole().subscribe((res:any)=>{
      if(!res.err){
         res.body.filter(i=>{ this.roleData1.push(i.id.toString())})
              // this.roleData.map(i=>{
              //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
              //    this.roleData1.push(i)
              //  }
              // })
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  getPrmsnData(){
    let post=[];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              // if(i.permission_name == 'Department'){
              //     this.dprtmnt=JSON.parse(i.row_data);
              //     this.frstDp = this.dprtmnt[0]?.name
              //  }
               if(i.permission_name == 'Permissions'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.assPrms  = i.assignResidentCount_permission
             }
            }
          })
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    // console.log('this.userDetails', this.fileToUpload)
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload)

    this.dataSrv.importPermissionReport(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataSrv.genericErrorToaster();
      })
  }

  handleChange(e){
    this.usrRlNo = e
    if(e == 1){
      this.dataSrv.getCommunityId().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        });
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    } else if(e == 2){
      this.dataSrv.agenciesID().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
            if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
            return 0;
        });
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      },
        (err) => {
          this.dataSrv.genericErrorToaster();
        })
    } else if(e == 3){
      this.dataSrv.getManagementNames().subscribe(res => {
        if (!res.error) {
          this.allCommunity = res.body.sort(function(a, b){
            if(a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
            if(a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
            return 0;
        });
          // this.rows1.forEach(element => {
         //   this.mngmNames.push(element)
          // });
          // console.log('Management Names',this.mngmNames)
        }})
    }  
    else{
      this.dataSrv.getDefaultRole().subscribe((res:any) => {
        // console.log(res,'resssssssssssss');
        
        if (!res.error) {
      
          this.roleData = res.body.sort(function(a, b){
            if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
            if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
            return 0;
        });
          // this.rows1.forEach(element => {
         //   this.mngmNames.push(element)
          // });
          // console.log('Management Names',this.mngmNames)
        }
      })
    }   

  }
}
