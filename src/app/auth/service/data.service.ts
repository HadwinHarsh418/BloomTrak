import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { InterceptorSkipHeader } from 'app/auth/helpers/jwt.interceptor';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrManager } from 'ng6-toastr-notifications';
import { map } from 'rxjs/operators';

// export interface Person {
//   id: string;
//   isActive: boolean;
//   age: number;
//   name: string;
//   gender: string;
//   company: string;
//   email: string;
//   phone: string;
//   disabled?: boolean;
// }

@Injectable({
  providedIn: 'root'
})
export class DataService {
  [x: string]: any;
  geodata: any = null;
  devicedata: any = null;
  UserRoles = [
    { "id": 1, "name": "Community", "slug": "community" },
    { "id": 2, "name": "Agency Administrator", "slug": "agency_administrator" },
    { "id": 8, "name": "Management", "slug": "management" },
    { "id": 3, "name": "Management USer", "slug": "management user" },
    { "id": 4, "name": "Employee", "slug": "employee" },
    { "id": 5, "name": "Agency User", "slug": "agency_user" },
    { "id": 6, "name": "Master Administrator", "slug": "super_admin" },
    { "id": 14, "name": "Editor", "slug": "editor" },
    { "id": 15, "name": "Scheduler", "slug": "scheduler" },
    { "id": 16, "name": "Community Admin", "slug": "community_admin" },
    { "id": 17, "name": "Agency Scheduler", "slug": "agency_scheduler" },
    { "id": 18, "name": "Shiftrak User", "slug": "shiftrak_user" },
    { "id": 19, "name": "Shiftrak Reporting", "slug": "shiftrak_reporting" },
    { "id": 20, "name": "Shiftrak Scheduler", "slug": "shiftrak_scheduler" },
    { "id": 21, "name": "Shiftrak Administrator", "slug": "shiftrak_administrator" },
    { "id": 22, "name": "Spendtrak Reporting", "slug": "spendtrak_reporting" },
    { "id": 23, "name": "Spendtrak Coder", "slug": "spendtrak_coder" },
    { "id": 24, "name": "Spendtrack Administrator", "slug": "spendtrack_administrator" }];
  // transactionPriorityArray: any = [
  //   'Cashout', 'Deposit', 'Bonus'
  // ]
  // paymentTypePriority: any = ['EURO', 'BTC'];
  public openModal = new BehaviorSubject<boolean>(false);
  // public refreshList = new BehaviorSubject<boolean>(false);

  // public openwithdrawal = new BehaviorSubject<boolean>(false);
  public opentIdentificaitonModal = new BehaviorSubject<any>(false);
  public openDeposit = new BehaviorSubject<any>(false);
  minimumAmount: any = { id: 1, min_deposit: 5, min_property_Invest: 88, min_tick_Invest: 0.1, min_withdrawl: 0, first_autoplay_invest: 44, autoplay_invest: 88, max_deposit: 144000, daily_withdrawal: 20000, vip_daily_withdrawal: 100000, min_tick_Invest_inbithome: 1 };
  cpUserData: any = "eyJ1ZXJuYW1lIjoic2l4cHJvZml0ZGV2IiwidXNlcm5hbWUiOiJzaXhwcm9maXRkZXYiLCJtZXJjaGFudF9pZCI6ImU1OGRlZWNiM2ViMzk1MmViMDhiYjViYTU3YmY1NmUyIiwiZW1haWwiOiJwcm9jcnlwdG9sZWFkZXJAZ21haWwuY29tIiwicHVibGljX25hbWUiOiJCSVRPTUFUSUMiLCJ0aW1lX2pvaW5lZCI6MTU3MzY2MDY2MX0=";

  interval: any;
  startTime: any;
  currentTime: any;
  timTrack = new BehaviorSubject<any>('');
  UserPermissions: any;
  getRls: any;

  constructor(private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private toaster: ToastrManager

  ) {
  }

  getIp() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://jsonip.com');
  }

  getGeoData() {
    let headers = new HttpHeaders().set(InterceptorSkipHeader, '')
    return this.http.get('https://geolocation-db.com/json/');
  }


  loginLog(input_data) {
    return this.http.post(environment.baseApiUrl + 'loginLog/?lang=en', input_data)
  }

  addNewDepartment(data) {
    return this.http.post(`${environment.baseApiUrl}addNewDepartment`, data);
  }

  getDepartmentUser(data) {
    return this.http.post(`${environment.baseApiUrl}getDepartmentUser`, data);
  }

  cancelShiftStatus(data) {
    return this.http.post(`${environment.baseApiUrl}cancelShiftStatus `, data);
  }

  editSpendDownOthersTableById(data) {
    return this.http.post(`${environment.baseApiUrl}editSpendDownOthersTableById`, data);
  }

  addSpendDownOthersTable(data) {
    return this.http.post(`${environment.baseApiUrl}addSpendDownOthersTable`, data);
  }

  replaceShiftUser(data) {
    return this.http.post(`${environment.baseApiUrl}replaceShiftUser`, data);
  }

  checkShortName(data) {
    return this.http.post(`${environment.baseApiUrl}checkShortName`, data);
  }

  approveSpendDownOthersTable(data) {
    return this.http.post(`${environment.baseApiUrl}approveSpendDownOthersTable`, data);
  }

  deleteSpendDownOthersTable(data) {
    return this.http.post(`${environment.baseApiUrl}deleteSpendDownOthersTable`, data);
  }

  updateUsername(data) {
    return this.http.post(`${environment.baseApiUrl}updateUsername`, data);
  }

  addManagementUserCommunities(data) {
    return this.http.post(`${environment.baseApiUrl}addManagementUserCommunities`, data);
  }


  deleteBudgerImport(data) {
    return this.http.post(`${environment.baseApiUrl}deleteBudgerImport`, data);
  }

  deleteImportBudgerResidentDay(data) {
    return this.http.post(`${environment.baseApiUrl}deleteImportBudgerResidentDay`, data);
  }

  deleteImportVendorContracts(data) {
    return this.http.post(`${environment.baseApiUrl}deleteImportVendorContracts`, data);
  }

  getNewDepartment() {
    return this.http.get(`${environment.baseApiUrl}getNewDepartment`);
  }
  getNewDepartmentById(id?: any) {
    let d = {
      community_id: id
    }
    return this.http.get(`${environment.baseApiUrl}getNewDepartment`);
  }

  getManagementUsers() {
    return this.http.get(`${environment.baseApiUrl}getManagementUsers`,);
  }
  getDefaultRole() {
    return this.http.get(`${environment.baseApiUrl}getDefaultRole`,);
  }

  getGlDepartment() {
    return this.http.get(`${environment.baseApiUrl}getGlDepartment`,);
  }

  getAllRole() {
    if (sessionStorage.getItem('Token'))
      return this.http.get(`${environment.baseApiUrl}getAllRole`,);
  }

  clockInPortalLogin(id) {
    return this.http.post(`${environment.baseApiUrl}clockInPortalLogin`, id);
  }

  addNotification(data) {
    return this.http.post(`${environment.baseApiUrl}addNotification`, data);
  }

  updateCommunityShortname(data) {
    return this.http.post(`${environment.baseApiUrl}updateCommunityShortname`, data);
  }

  addCommunitySetting(data) {
    return this.http.post(`${environment.baseApiUrl}addCommunitySetting`, data);
  }

  editCommunitySetting(data) {
    return this.http.post(`${environment.baseApiUrl}editCommunitySetting`, data);
  }

  getCommunitySetting(id) {
    return this.http.get(`${environment.baseApiUrl}getCommunitySetting?id=${id}`,);
  }
  getCommunityBreakSetting(id) {
    return this.http.get(`${environment.baseApiUrl}getCommunityBreakSetting?id=${id}`,);
  }

  getUserCanceledShiftById(id) {
    return this.http.get(`${environment.baseApiUrl}getUserCanceledShiftById?id=${id}`,);
  }

  getSpendDownOthersTableById(id) {
    return this.http.get(`${environment.baseApiUrl}getSpendDownOthersTableById?id=${id}`,);
  }

  getManagementUserCommunities(data) {
    return this.http.get(`${environment.baseApiUrl}getManagementUserCommunities?user_id=${data.userId}&management_id=${data.mangId}`,);
  }

  deleteCommunitySetting(data) {
    return this.http.post(`${environment.baseApiUrl}deleteCommunitySetting`, data);
  }

  getNotification(data) {
    return this.http.get(`${environment.baseApiUrl}getNotification?isAdmin=${data.usrRole}&community_id=${data.comId}`,);
  }

  deleteNotification(data) {
    return this.http.post(`${environment.baseApiUrl}deleteNotification`, data);
  }

  getNotificationById(id) {
    return this.http.get(`${environment.baseApiUrl}getNotificationById?id=${id.id}`);
  }

  getSpendDownOthersTable(id, depr, comId) {
    return this.http.get(`${environment.baseApiUrl}getSpendDownOthersTable?entered_by=${id}&department=${depr}&community_id=${comId}`);
  }

  editNotification(data) {
    return this.http.post(`${environment.baseApiUrl}editNotification`, data);
  }
  addVendor(data) {
    return this.http.post(`${environment.baseApiUrl}addVendor`, data);
  }


  deleteVendor(data) {
    return this.http.post(`${environment.baseApiUrl}deleteVendor`, data);
  }

  editVendor(data) {
    return this.http.post(`${environment.baseApiUrl}editVendor`, data);
  }

  getVendor(data) {
    return this.http.get(`${environment.baseApiUrl}getVendor?isAdmin=${data.usrRole}&community_id=${data.comId}`,);
  }

  getVendorById(id) {
    return this.http.get(`${environment.baseApiUrl}getVendorById?id=${id.id}`);
  }

  updateAgencyCommunity(data) {
    return this.http.post(`${environment.baseApiUrl}updateAgencyCommunity`, data);
  }

  addUserRated(data) {
    return this.http.post(`${environment.baseApiUrl}addUserRated`, data);
  }

  getAgencyCommunity(id) {
    return this.http.get(`${environment.baseApiUrl}getAgencyCommunity?agency_id=${id}`);
  }

  getAgencyContractById(id) {
    return this.http.get(`${environment.baseApiUrl}getAgencyContractById?agency_id=${id}`);
  }

  getLastEntrySummery(comId, isfor, day) {
    return this.http.get(`${environment.baseApiUrl}getLastEntrySummery?community_id=${comId}&is_for=${isfor}&day=${day}`);
  }

  updateUserRated(data) {
    return this.http.post(`${environment.baseApiUrl}updateUserRated`, data);
  }

  deleteUserRated(id) {
    return this.http.post(`${environment.baseApiUrl}deleteUserRated`, id);
  }

  getAllCAUserRates(id, role, userId) {
    if (role == 'SuperAdmin') {
      return this.http.get(`${environment.baseApiUrl}getAllUserRates?id=${userId}`);
    } else {
      return this.http.get(`${environment.baseApiUrl}getAllCAUserRates?id=${id}`);
    }
  }

  updateAdjClockTime(data) {
    return this.http.post(`${environment.baseApiUrl}updateAdjClockTime`, data);
  }


  editCMUser(data) {
    return this.http.post(`${environment.baseApiUrl}editCMUser`, data);
  }

  addFixeExpensesTable(data) {
    return this.http.post(`${environment.baseApiUrl}addFixeExpensesTable`, data);
  }

  editFixeExpensesTable(data) {
    return this.http.post(`${environment.baseApiUrl}editFixeExpensesTable`, data);
  }

  deleteFixeExpensesTable(data) {
    return this.http.post(`${environment.baseApiUrl}deleteFixeExpensesTable`, data);
  }

  getFixeExpensesTable() {
    return this.http.get(`${environment.baseApiUrl}getFixeExpensesTable`,);
  }

  getFixeExpensesTableById(id) {
    return this.http.get(`${environment.baseApiUrl}getFixeExpensesTableById?${id.community_id}=${id.id}`,);
  }

  addBudgetTable(data) {
    return this.http.post(`${environment.baseApiUrl}addBudgetTable`, data);
  }

  editBudgetTable(data) {
    return this.http.post(`${environment.baseApiUrl}editBudgetTable`, data);
  }

  deleteBudgetTable(data) {
    return this.http.post(`${environment.baseApiUrl}deleteBudgetTable`, data);
  }

  getBudgetTableById(id) {
    return this.http.get(`${environment.baseApiUrl}getBudgetTableById?id=${id}`);
  }

  getspendDownTableById(id) {
    return this.http.get(`${environment.baseApiUrl}getspendDownTableById?id=${id}`);
  }

  getDepartmentSummary(data) {
    return this.http.get(`${environment.baseApiUrl}getDepartmentSummary?community_id=${data.community_id}&department=${data.department}&year=${data.year}&month=${data.month}`);
  }

  addDepartmentExplanation(data) {
    return this.http.post(`${environment.baseApiUrl}addDepartmentExplanation`, data);
  }

  updateDepartmentExplanation(data) {
    return this.http.post(`${environment.baseApiUrl}updateDepartmentExplanation`, data);
  }

  getDepartmentListing(id, isfor, for_other): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getDepartment?community_id=${id}&is_for=${isfor}&for_other=${for_other}`)
  }

  getBudgetTable(data) {
    return this.http.get(`${environment.baseApiUrl}getBudgetTable?searchStr=${data.searchStr}&isAdmin=${data.usrRole}&community_id=${data.comId}`);
  }

  addAccessTo(data) {
    return this.http.post(`${environment.baseApiUrl}addAccessTo`, data);
  }

  deleteRole(id) {
    return this.http.post(`${environment.baseApiUrl}deleteRole`, id);
  }

  addRole(data) {
    return this.http.post(`${environment.baseApiUrl}addRole`, data);
  }
  addDefaultRole(data) {
    return this.http.post(`${environment.baseApiUrl}addDefaultRole`, data);
  }

  editRole(data) {
    return this.http.post(`${environment.baseApiUrl}editRole`, data);
  }

  updateUserRoles(data) {
    return this.http.post(`${environment.baseApiUrl}updateUserRoles`, data);
  }

  getRole(data: any) {
    return this.http.get(`${environment.baseApiUrl}getRole?${data.prms}=${data.id}`);

    // console.log(this.getRls);
    // if(this.getRls?.body?.length) {
    //   return of(this.getRls);
    // }
    // return this.http.get(`${environment.baseApiUrl}getRole`).pipe(
    //   map((res:any) => {
    //     if (!res.error) {
    //       this.getRls = res;
    //     } 
    //     return res;
    //   })
    // );
  }

  getUserRoles(user_id) {
    return this.http.get(`${environment.baseApiUrl}getUserRoles?user_id=${user_id}`);
  }

  getPermissionByAdminRole() {
    if (sessionStorage.getItem('Token'))
      return this.http.get(`${environment.baseApiUrl}getPermissionByAdminRole`).pipe(
        map((res: any) => {
          if (!res.error) {
            this.UserPermissions = res;
          }
          return res;
        })
      );
  }

  addPermission(data) {
    return this.http.post(`${environment.baseApiUrl}addPermission`, data);
  }

  getPermission(is_for) {
    return this.http.get(`${environment.baseApiUrl}getPermission?is_for=${is_for.is_for}`);
  }

  getPermissionByID(id) {
    return this.http.get(`${environment.baseApiUrl}getPermissionByID?id=${id}`);
  }
  getPermissionById(page_id, role_id) {
    return this.http.get(`${environment.baseApiUrl}getPermissionToRoleById?page_id=${page_id}&role_id=${role_id}`);
  }
  addPermissionToRole(data) {
    return this.http.post(`${environment.baseApiUrl}addPermissionToRole`, data);
  }
  editPermissionToRole(data) {
    return this.http.post(`${environment.baseApiUrl}editPermissionToRole`, data);
  }
  deletePermissionToRole(data) {
    return this.http.post(`${environment.baseApiUrl}deletePermissionToRole`, data);
  }
  addCMAccessTo(data) {
    return this.http.post(`${environment.baseApiUrl}addCMAccessTo`, data);
  }
  getCMAccessTo() {
    return this.http.get(`${environment.baseApiUrl}getCMAccessTo`);
  }
  getCMAccessByID(community_id) {
    return this.http.get(`${environment.baseApiUrl}getCMAccessToById?community_id=${community_id}`);
  }
  deleteCMAccess(data) {
    return this.http.post(`${environment.baseApiUrl}deleteCMAccessTo`, data);
  }
  addType(data) {
    return this.http.post(`${environment.baseApiUrl}addExpenceType`, data);
  }
  editType(data) {
    return this.http.post(`${environment.baseApiUrl}editExpenceType`, data);
  }
  getType() {
    return this.http.get(`${environment.baseApiUrl}getExpenceType`);
  }
  getTypeByID(type_id) {
    return this.http.get(`${environment.baseApiUrl}getExpenceTypeById?id=${type_id}`);
  }
  deleteType(data) {
    return this.http.post(`${environment.baseApiUrl}deleteExpenceType`, data);
  }
  addCurrency(data) {
    return this.http.post(`${environment.baseApiUrl}addcurrency`, data);
  }
  editCurrency(data) {
    return this.http.post(`${environment.baseApiUrl}editcurrency`, data);
  }
  getCurrency() {
    return this.http.get(`${environment.baseApiUrl}getcurrency`);
  }
  deleteCurrency(data) {
    return this.http.post(`${environment.baseApiUrl}deletecurrency`, data);
  }
  addAdminSetting(data) {
    return this.http.post(`${environment.baseApiUrl}addAdminSetting`, data);
  }
  editAdminSetting(data) {
    return this.http.post(`${environment.baseApiUrl}editAdminSetting`, data);
  }
  getAdminSetting() {
    return this.http.get(`${environment.baseApiUrl}getAdminSetting`);
  }
  deleteAdminSetting(data) {
    return this.http.post(`${environment.baseApiUrl}deleteAdminSetting`, data);
  }
  getAdminSettingById(id) {
    return this.http.get(`${environment.baseApiUrl}getAdminSettingById?id=${id}`);
  }
  addLedger(data) {
    return this.http.post(`${environment.baseApiUrl}addgeneralLedger`, data);
  }
  editLedger(data) {
    return this.http.post(`${environment.baseApiUrl}editgeneralLedger`, data);
  }
  getLedger(data) {
    return this.http.get(`${environment.baseApiUrl}getgeneralLedger?searchStr=${data.searchStr}&isAdmin=${data.usrRole}&community_id=${data.comId}`);
  }
  getLedgerById(id) {
    return this.http.get(`${environment.baseApiUrl}getgeneralLedgerById?${id.community_id}=${id.id}`);
  }
  deleteLedger(data) {
    return this.http.post(`${environment.baseApiUrl}deletegeneralLedger`, data);
  }
  addBudgetResidentDays(data) {
    return this.http.post(`${environment.baseApiUrl}addBudgetResidentDay`, data);
  }
  editBudgetResidentDays(data) {
    return this.http.post(`${environment.baseApiUrl}editBudgetResidentDay`, data);
  }

  SpendEditBudgetRD(data) {
    return this.http.post(`${environment.baseApiUrl}SpendEditBudgetRD`, data);
  }

  getBudgetResidentDays(data) {
    return this.http.get(`${environment.baseApiUrl}getBudgetResidentDay?isAdmin=${data.usrRole}&community_id=${data.comId}`);
  }
  getBudgetResidentDaysById(id) {
    return this.http.get(`${environment.baseApiUrl}getBudgetResidentDayById?id=${id}`);
  }
  deleteBudgetResidentDays(data) {
    return this.http.post(`${environment.baseApiUrl}deleteBudgetResidentDay`, data);
  }

  addPaymentType(data) {
    return this.http.post(`${environment.baseApiUrl}addPaymentType`, data);
  }
  editPaymentType(data) {
    return this.http.post(`${environment.baseApiUrl}editPaymentType`, data);
  }
  getPaymentType() {
    return this.http.get(`${environment.baseApiUrl}getPaymentType`);
  }
  deletePaymentType(data) {
    return this.http.post(`${environment.baseApiUrl}deletePaymentType`, data);
  }
  addSpendDown(data) {
    return this.http.post(`${environment.baseApiUrl}addspendDownTable`, data);
  }
  editSpendDown(data) {
    return this.http.post(`${environment.baseApiUrl}editspendDownTable`, data);
  }
  getSpendDown(data) {
    return this.http.get(`${environment.baseApiUrl}getspendDownTable?community_id=${data?.community_id}&department=${data?.department}&year=${data?.year}&month_name=${data?.month_name}`);
  }
  deleteSpendDown(data) {
    return this.http.post(`${environment.baseApiUrl}deletespendDownTable`, data);
  }
  getSpendDownById(id) {
    return this.http.get(`${environment.baseApiUrl}getspendDownTableById?${id.community_id}=${id.id}`);
  }

  getPaymentTypeById(id) {
    return this.http.get(`${environment.baseApiUrl}getPaymentTypeById?id=${id}`);
  }

  addVendorContract(data) {
    return this.http.post(`${environment.baseApiUrl}addVendorContracts`, data);
  }
  editVendorContract(data) {
    return this.http.post(`${environment.baseApiUrl}editVendorContracts`, data);
  }
  getVendorContract(searchStr, comId, page, limit, filterDep) {
    return this.http.get(`${environment.baseApiUrl}getVendorContracts?searchStr=${searchStr}&community_id=${comId}&pageNo=${page}&limitNum=${limit}&department=${filterDep}`);
  }
  deleteVendorContract(data) {
    return this.http.post(`${environment.baseApiUrl}deleteVendorContracts`, data);
  }
  getVendorContractById(id) {
    return this.http.get(`${environment.baseApiUrl}getVendorContractsById?${id.community_id}=${id.id}`);
  }
  getCMAccessToByDate(id) {
    return this.http.get(`${environment.baseApiUrl}getCMAccessToByDate?community_id=${id}`);

  }
  deletePermission(id) {
    return this.http.post(`${environment.baseApiUrl}deletePermission`, id);
  }

  editPermission(data) {
    return this.http.post(`${environment.baseApiUrl}editPermission`, data);
  }

  markShiftCompleteByID(id) {
    return this.http.post(`${environment.baseApiUrl}markShiftCompleteByID`, id);
  }

  importUsers(payload) {
    // let header = new HttpHeaders();
    // header = header.append('Content-Type', 'multipart/form-data');
    return this.http.post(`${environment.baseApiUrl}importUsers`, payload);
  }

  importCommunities(payload) {
    return this.http.post(`${environment.baseApiUrl}importCommunities `, payload);
  }

  importBudget(payload) {
    return this.http.post(`${environment.baseApiUrl}importBudget `, payload);
  }

  importAgencies(payload) {
    return this.http.post(`${environment.baseApiUrl}importAgencies `, payload);
  }

  importSpendDownTable(payload) {
    return this.http.post(`${environment.baseApiUrl}importSpendDownTable `, payload);
  }

  importPermissionReport(payload) {
    return this.http.post(`${environment.baseApiUrl}importPermissionReport `, payload);
  }

  importGeneralLedger(payload) {
    return this.http.post(`${environment.baseApiUrl}importGeneralLedger `, payload);
  }

  uploadAgencyContract(payload) {
    return this.http.post(`${environment.baseApiUrl}uploadAgencyContract `, payload);
  }

  importAgencyRates(payload) {
    return this.http.post(`${environment.baseApiUrl}importAgencyRates `, payload);
  }

  importVonderCont(payload) {
    return this.http.post(`${environment.baseApiUrl}importVonderCont  `, payload);
  }

  uploadVenderContract(payload) {
    return this.http.post(`${environment.baseApiUrl}uploadVenderContract  `, payload);
  }

  importBudgetResident(payload) {
    return this.http.post(`${environment.baseApiUrl}importBudgetResident  `, payload);
  }

  phoneNoverified(id) {
    return this.http.post(`${environment.baseApiUrl}phoneNoverified`, id);
  }

  forgotPassword(id) {
    return this.http.post(`${environment.baseApiUrl}forgotPassword`, id);
  }

  editHolidayByID(data) {
    return this.http.post(`${environment.baseApiUrl}editHolidayByID`, data);
  }

  editAgencyRates(data) {
    return this.http.post(`${environment.baseApiUrl}editAgencyRates`, data);
  }

  deleteProject(id) {
    return this.http.post(`${environment.baseApiUrl}deleteProject/`, id);
  }

  agencyRates(data) {
    return this.http.post(`${environment.baseApiUrl}agencyRates`, data);
  }

  terminateUser(data) {
    return this.http.post(`${environment.baseApiUrl}terminateUser`, data);
  }

  notificationEnableDisable(data) {
    return this.http.post(`${environment.baseApiUrl}notificationEnableDisable`, data);
  }

  generateSecret_Id(data) {
    return this.http.get(`${environment.baseApiUrl}generateSecretKey/${data}`);
  }

  addClockOut(data) {
    return this.http.post(`${environment.baseApiUrl}addClockOut`, data);
  }

  addBLockedUser(data) {
    return this.http.post(`${environment.baseApiUrl}addBLockedUser`, data);
  }

  cancelUAppliedShift(data) {
    return this.http.post(`${environment.baseApiUrl}cancelUAppliedShift`, data);
  }

  cancelAppliedShift(data) {
    return this.http.post(`${environment.baseApiUrl}cancelAppliedShift`, data);
  }

  deletedBLockedUser(data: any) {
    return this.http.put(`${environment.baseApiUrl}deletedBLockedUser?id=${data}`, '');
  }

  getArchive(data: any) {
    return this.http.get(`${environment.baseApiUrl}getArchive?community_id=${data}`,);
  }

  getAgencyMonthlyBudget(data: any) {
    return this.http.get(`${environment.baseApiUrl}getAgencyMonthlyBudget?community_id=${data}`,);
  }


  getHolidayByID(data: any) {
    return this.http.get(`${environment.baseApiUrl}getHolidayByID?id=${data}`,);
  }

  getAgencyRatesById(data: any) {
    return this.http.get(`${environment.baseApiUrl}getAgencyRatesById?id=${data.id}`,);
  }

  getAgencyUnblockUser(data, agency_id) {
    return this.http.get(`${environment.baseApiUrl}getAgencyUnblockUser?community_id=${data}&agency_id=${agency_id}`,);
  }

  shiftClockIn(data) {
    return this.http.post(`${environment.baseApiUrl}shiftClockIn`, data);
  }

  verifyUser(data) {
    return this.http.post(`${environment.baseApiUrl}verifyUser`, data);
  }

  addUserData(data) {
    return this.http.post(`${environment.baseApiUrl}addUserData`, data);
  }

  deleteManagenment(id) {
    return this.http.post(`${environment.baseApiUrl}deleteManagenment`, id);
  }

  updateUserPassword(data) {
    return this.http.post(`${environment.baseApiUrl}updateUserPassword`, data);
  }

  editProject(data) {
    return this.http.post(`${environment.baseApiUrl}editProject/`, data);
  }

  startShiftByID(data) {
    return this.http.post(`${environment.baseApiUrl}startShiftByID`, data);
  }

  endShiftByID(data) {
    return this.http.post(`${environment.baseApiUrl}endShiftByID`, data);
  }

  completeShiftByID(data) {
    return this.http.post(`${environment.baseApiUrl}completeShiftByID`, data);
  }

  assignShift(data) {
    return this.http.post(`${environment.baseApiUrl}assignShift`, data);
  }

  assignAGShift(data) {
    return this.http.post(`${environment.baseApiUrl}assignAGShift`, data);
  }

  sms(data) {
    return this.http.post(`${environment.baseApiUrl}sms`, data);
  }

  getAppliedShiftById(data) {
    return this.http.post(`${environment.baseApiUrl}getAppliedShiftById`, data);
  }

  verifyOtp(data) {
    return this.http.post(`${environment.baseApiUrl}verifyOtp`, data);
  }

  editManagementByID(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}editManagementByID`, data);
  }

  updateManagementId(data) {
    return this.http.post(`${environment.baseApiUrl}updateManagementId`, data);
  }

  editCommunity(data) {
    return this.http.post(`${environment.baseApiUrl}editCommunity`, data);
  }


  editAgencies(data: any) {
    return this.http.post(`${environment.baseApiUrl}editAgencies`, data);
  }

  addManagement(data) {
    return this.http.post(`${environment.baseApiUrl}addManagement`, data);
  }

  editshift(data) {
    return this.http.post(`${environment.baseApiUrl}editshift`, data);
  }

  applyShift(data) {
    return this.http.post(`${environment.baseApiUrl}applyShift`, data);
  }

  updateAprroval(data) {
    return this.http.post(`${environment.baseApiUrl}updateAprroval`, data);
  }

  getCommunityShiftByID(searchStr = '', for_cp1, currentUser1, cpType, tpUsr) {
    if (tpUsr == 'typeUser') {
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${currentUser1}?searchStr1=${searchStr}&for_cp=${for_cp1}&typeUser=${cpType.cpType2}`);
    } else {
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${currentUser1}?searchStr2=${searchStr}&for_cp=${for_cp1}&typeUser=${null}&typeUser1=${cpType.cpType2}`);
    }
  }
  getNewCommunityShiftByID(body: any, user?: any) {
    if (body.tpUsr == 'typeUser') {
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${body.currentUser}?searchStr1=${body.searchStr}&for_cp=${body.for_cp1}&typeUser=${body.cpType}`);
    } else {
      return this.http.get(`${environment.baseApiUrl}getCommunityShiftByID/${body.currentUser}?searchStr2=${body.searchStr}&for_cp=${body.for_cp1}&typeUser=${body.cpType}&typeUser1=${body.cpType}`);
    }
  }

  getCommunityShift(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityShift/${id}`,);
  }

  getAgencyRates(searchStr = '', cpType, role, id): Observable<any> {
    if (role == 'Agency') {
      return this.http.get(`${environment.baseApiUrl}getAgencyRates?searchStr1=${searchStr}&typeUser=${cpType.cpType2}&agency_id=${id}`);
    } if (role == 'Community') {
      return this.http.get(`${environment.baseApiUrl}getAgencyRates?searchStr2=${searchStr}&typeUser=${null}&typeUser1=${cpType.cpType2}&agency_id=${id}`);
    } else {
      return this.http.get(`${environment.baseApiUrl}getAgencyRates?searchStr3=${searchStr}&typeUser=${null}&typeUser2=${cpType.cpType2}&agency_id=${id}`);
    }
    // return this.http.get(`${environment.baseApiUrl}getAgencyRates?searchStr=${searchStr}&agency_id=${id}`,);
  }


  getUserAgencyshiftById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUserAgencyshiftById?id=${id}`,);
  }

  getCommunityUserWorking(id, searchVal?): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityUserWorking?id=${id}&searchStr1=${searchVal}`);
  }

  getClockOut(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getClockOut?shift_id=${id.shift_id}&agency_id=${id.agency_id}`,);
  }

  // userStartedShiftByID(id): Observable<any> {
  //   return this.http.get(`${environment.baseApiUrl}userStartedShiftByID?user_id=${id.user_id}&is_for=${id.is_for}`,);
  // }

  getManagementNames(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagementNames`);
  }

  getHoliday(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getHoliday?id=${id.id}`);
  }

  getBLockedUser(searchStr?): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getBLockedUser?searchStr1=${searchStr}`);
  }

  getMNGTUser(searchStr = '', page, limit): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getMNGTUser?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  getCommunityShifts(searchStr = '', page, shiftType, currentUser1, limit, start_time, end_time): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityShifts/${currentUser1}?searchStr=${searchStr}&pageNo=${page}&typeUser=${shiftType}&limitNum=${limit}&start_time=${start_time}&end_time=${end_time}`,);
  }

  getNewCommunityShifts(body: any): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCommunityShifts/${body.currentUser}?searchStr=${body.searchStr}&pageNo=${body.page}&typeUser=${body.shiftType}&limitNum=${body.limit}&start_time=${body.start_time}&end_time=${body.end_time}`,);
  }

  getShiftClockIn(data): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getShiftClockIn?shift_id=${data.shift_id}&agency_id=${data.agency_id}`,);
  }


  getLoginLogs(id) {
    return this.http.get(`${environment.baseApiUrl}loginLogHistory/${id}`);

  }

  getAllUsers(searchStr = ''): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAllUsers?searchStr=${searchStr}`);
  }

  getcommunity(searchStr = '', page, limit): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getcommunity?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  getUserAssignedShift(data): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUserAssignedShift?shift_id=${data}`);
  }

  getAgency(searchStr = '', page, limit, community_id = null, is_for, typeDrop): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgencies?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&community_id=${community_id}&is_for=${is_for}&typeDrop=${typeDrop}`);
  }

  getManagement(searchStr = '', page): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagement?searchStr=${searchStr}&pageNo=${page}`);
  }

  getshift(searchStr = '', page, limit, userShift): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getshift?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&typeUser=${userShift}`)
  }
  getNewshift(body: any): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getshift?searchStr=${body.searchStr}&pageNo=${body.page}&limitNum=${body.limit}&typeUser=${body.userShift}`)
  }

  getCommunityId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}communityID`);
  }

  getUserId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}userID`);
  }

  getAllCgetcommunityForAgencyRatesom(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getcommunityForAgencyRates`);
  }

  getusercommunityById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getusercommunityById?id=${id}`);
  }

  getMNMGcommunity(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getMNMGcommunity?id=${id}`);
  }

  getAgencyId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}agenciesID`);
  }

  getProjectId(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}projectID`);
  }

  addProject(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addProject`, data);
  }

  clockInPortal(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}clockInPortal`, data);
  }

  agenciesID(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}agenciesID`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}register`, data);
  }

  addAgency(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addAgencies`, data);
  }

  assignContract(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}assignContract`, data);
  }

  updatePrimaryContact(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updatePrimaryContact`, data);
  }

  updateAgencyPassword(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateAgenciesPassword`, data);
  }

  updateCommunityPassword(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateCommunityPassword`, data);
  }

  updateSurveyCompliance(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateSurveyCompliance`, data);
  }

  updateManagementCompany(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateManagementCompany`, data);
  }

  updateSinleCOm(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}updateSingleCommunity`, data);
  }

  deleteUser(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteCommunity`, data);
  }

  deleteUserById(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteUser`, data);
  }

  deleteActivity(data): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteAgencies`, data);
  }

  genericErrorToaster(Msg: string = '') {
    let error = Msg || 'Oops! something went wrong, please try again later.'
    this.toaster.errorToastr(error);
  }

  getAllDriver(searchStr = ''): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAllDriver?searchStr=${searchStr}`);
  }

  getProjectById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getProjectById?id=${id}`);
  }

  getManagementById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getManagementById?id=${id}`);
  }

  getcommunityById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getcommunityById?id=${id}`);
  }
  getUserAssigned(shift_id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUserAssigned?shift_id=${shift_id}`);
  }
  getCMUserAssigned(shift_id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getCMUserAssigned?shift_id=${shift_id}`);
  }

  getAgenciesByID(id?): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgenciesByID?id=${id ?? ''}`);
  }
  getAgenciesNewByID(id?): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgenciesByID?id=${id ?? ''}&is_for=community`);
  }

  getUserById(searchStr = '', id, is_for): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUserById?searchStr=${searchStr}&id=${id}&is_for=${is_for}`);
  }

  getshiftById(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getshiftById?id=${id}`);
  }

  deleteshift(id): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}deleteshift`, id);
  }

  getUser(searchStr = '', page, limit, is_for): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getUser?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}&is_for=${is_for}`);
  }

  getContract(searchStr = '', page, limit,): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getContract?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }
  getAgencyListing(id): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getAgencies?searchStr=&pageNo=0&limitNum=10&community_id=${id}&is_for=community`);
  }
  getProject(searchStr = '', page, limit, community_id = null, agency_id = null): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}getProject?searchStr=${searchStr}&pageNo=${page}&limitNum=${limit}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addUser`, data);
  }

  addAgencyUser(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addAgencyUser`, data);
  }

  addContract(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addContract`, data);
  }

  uploadVariance(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addVariance`, data);
  }

  editUser(data: any, is_for, role): Observable<any> {
    if (role == 'Community' || role == 'Community User') {
      return this.http.post(`${environment.baseApiUrl}editCMUser`, data);
    } else {
      return this.http.post(`${environment.baseApiUrl}editUser?is_for=${is_for}`, data);
    }
  }

  addHoliday(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}addHoliday`, data);
  }
  communitySetting(data: any): Observable<any> {
    return this.http.post(`${environment.baseApiUrl}communitySetting`, data);
  }

  // getBookingList(data): Observable<any> {
  //   // let params = '';
  //   // params += (data.start_date) ? `&start_date=${data.start_date}` : '';
  //   // params += (data.end_date) ? `&end_date=${data.end_date}` : '';
  //   // params += (data.typeUser) ? `&typeUser=${data.typeUser}` : '';
  //   return this.http.get(`${environment.baseApiUrl}bookingListing?enc=${data}`);
  // }

  // sortFtransactions(transactions) {
  //   let ot = transactions;
  //   // ot = ot.sort((a, b) => {
  //   //   return this.transactionPriorityArray.indexOf(a.order_type)
  //   //     - this.transactionPriorityArray.indexOf(b.order_type)
  //   // });
  //   // ot = ot.sort((a, b) => {
  //   //   if (a.payment_type && b.payment_type) {
  //   //     return this.paymentTypePriority.indexOf(a.payment_type)
  //   //       - this.paymentTypePriority.indexOf(b.payment_type)
  //   //   } else return 1;
  //   // });
  //   ot = ot.sort((a, b) => {
  //     let acd = this.changeDatetoTime(a.created_at)
  //     let bcd = this.changeDatetoTime(b.created_at)
  //     return bcd - acd
  //   });
  //   return ot;
  // }

  changeDatetoTime(crdt) {
    return new Date(crdt.replace('T', ' ').replace('.000Z', '').replace(/-/g, '/') + '').getTime();
  }

  // reqforAntiCode(input_data) {
  //   return this.http.post(`${environment.baseApiUrl}reqforAntiCode`, input_data);
  // }


  getGeoDevData() {
    this.getGeoData().subscribe(
      res => {
        this.geodata = res;
      }, error => {

      }
    );
  }

  getDeviceData() {
    this.devicedata = this.deviceService.getDeviceInfo();
    sessionStorage.setItem("device_type", this.devicedata['os']);
  }

  getgeoDevObject() {
    let locData: any = {};
    if (this.geodata) {
      locData.geoData = this.geodata;
      locData.ip_address = this.geodata.IPv4 ? this.geodata.IPv4 :
        this.geodata.IPv6 ? this.geodata.IPv6 : '';
      locData.area = this.geodata.city ? this.geodata.city
        : this.geodata.country ? this.geodata.country : '';
    }

    if (this.devicedata) {
      locData.deviceData = this.devicedata;
      locData.platform = this.devicedata.browser;
      locData.device = this.devicedata.os;
    }

    return locData;
  }

  startTracker(time): any {
    this.startTime = time ? time : 0;
    this.interval = setInterval(() => {
      this.startTime++;
    }, 60000);
  }

  closeTracker() {
    // this.startTime = 0;
    clearInterval(this.interval);
  }


  data1 = { com: "", mn: "", yr: "", drp: "" };

  setData(data) {
    let val = data
    this.data = val.split('');

    if (this.data.length == 36) {
      this.data1.com = data
    }
    else if (this.data?.length == 2) {
      this.data1.mn = data
    }
    else if (this.data?.length == 4) {
      this.data1.yr = data
    }
    else if (this.data.length) {
      this.data1.drp = data
    }
    else {
      return;
    }

  }

  getData() {
    let temp = this.data1;
    return temp;
  }

  clearData() {
    this.data1 = { com: "", mn: "", yr: "", drp: "" };
  }

}
