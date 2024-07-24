import { CoreMenu } from '@core/types';
import { Role } from 'app/auth/models';

export const menu: CoreMenu[] = [
  //  Menus
  //myaccount
  /*{
`    id:'myaccount',
    title: 'My Account',
    translate: 'MENU.MYACC.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'user',
    children: [
      {
        id: 'profile',
        title: 'Profile',
        translate: 'MENU.MYACC.PROFILE',
        type: 'item',
        icon: 'tool',
        url: 'my-account/profile'
      },
      {
        id: 'security',
        title: 'Security',
        translate: 'MENU.MYACC.SECURITY',
        type: 'item',
        icon: 'lock',
        url: 'my-account/security'
      },
      {
        id: 'emailContact',
        title: 'Email and Contact',
        translate: 'MENU.MYACC.EMAILCONTACT',
        type: 'item',
        icon: 'mail',
        url: 'my-account/email-contact'
      },
    ]
  }, */
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'mail',
    url: 'dashboard',
  },
  // {
  //   id: 'community',
  //   title: 'Communities',
  //   type: 'item',
  //   icon: 'users',
  //   url: 'community',
  //   role : [Role.Admin, ]

  // },
  
  // {
  //   id: 'agency',
  //   title: 'Agency',
  //   type: 'item',
  //   icon: 'codesandbox',
  //   url: 'agency',
  //   role : [Role.Admin]

  // },

 


  // {
  //   id: 'project',
  //   title: 'Project',
  //   type: 'item',
  //   icon: 'pie-chart',
  //   url: 'project',
  //   role : [Role.Admin, Role.SuperAdmin,Role.Community]


  // },
  // {
  //   id: 'contracts',
  //   title: 'Contracts',
  //   type: 'item',
  //   icon: 'clipboard',
  //   url: 'contracts',
  //   role : [Role.Admin, Role.SuperAdmin,Role.User]
  // },
 
  // {
  //   id: 'shift',
  //   title: 'Shifts',
  //   type: 'item',
  //   icon: 'layers',
  //   url: 'shift',
  //   role:[Role.Admin,Role.Agency,]
  // },
  // {
  //   id: 'management',
  //   title: 'Management <br> Company',
  //   type: 'item',
  //   icon: 'grid',
  //   url: 'management',
  //   role:[ Role.SuperAdmin]
  // },
  // {
  //   id: 'community',
  //   title: 'Community /<br>Agency List',
  //   type: 'item',
  //   icon: 'users',
  //   url: 'community',
  //   role : [Role.User]

  // },
  // {
  //   id: 'community',
  //   title: 'Reports',
  //   type: 'item',
  //   icon: 'clipboard',
  //   url: 'reports',
  //   role : [Role.Admin,Role.Agency]
  // },
  
  // {
  //   id: 'user',
  //   title: 'Agency Workers',
  //   type: 'item',
  //   icon: 'lock',
  //   url: 'blockUser',
  //   role : [Role.Community ]

  // },
  // {
  //   id: 'community',
  //   title: 'Department',
  //   type: 'item',
  //   icon: 'home',
  //   url: 'department',
  //   role : [Role.Community]

  // },
  // {
  //   id: 'certification',
  //   title: 'Certification',
  //   type: 'item',
  //   icon: 'align-justify',
  //   url: 'certification',
  //   role : [Role.Community]

  // },
  
  // },
  // {
  //   id: 'position',
  //   title: 'Position',
  //   type: 'item',
  //   icon: 'compass',
  //   url: 'position',
  //   role : [Role.Community]
  // },

  // {
  //   id: 'Agencyholiday',
  //   title: 'Agency Holiday',
  //   type: 'item',
  //   icon: 'award',
  //   url: 'agency-holiday',
  //   role : [Role.Community]
  // },
  // {
  //   id: 'agencyBudget',
  //   title: 'Agency Budget',
  //   type: 'item',
  //   icon: 'credit-card',
  //   url: 'budget-agency',
  //   role : [Role.Community]
  // },
  // {
  //   id: 'agencyRate',
  //   title: 'Agency Rates',
  //   type: 'item',
  //   icon: 'dollar-sign',
  //   url: 'agencyRate',
  //   role : [Role.Agency]
  //  },


 

 
  // {
  //   id: 'user',
  //   title: 'user',
  //   type: 'item',
  //   icon: 'codesandbox',
  //   url: 'user'
  // }
 
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   type: 'item',
  //   fontAwesomeIcon: ' fa fa-cogs',   
  //   url: 'settings',
    
  // },


  {
    id: 'community',
    title: 'shiftrak',
    type: 'collapsible',
    icon: 'folder-plus',
    // url: 'community',
    // role : [Role.Community,Role.SuperAdmin],
    access_to: ['shift_trak', 'both'],
    children : [
      {
        id: 'agency',
        title: 'Agency',
        type: 'item',
        icon: 'codesandbox',
        url: 'agency',
        // role : [Role.Community,Role.SuperAdmin,]
      },
      {
        id: 'user',
        title: 'Agency Personnel',
        type: 'item',
        icon: 'user',
        url: 'agency-personnel',
        role : [Role.Agency ,
          Role.Admin,
          Role.ClockIn,
          Role.Management,
          Role.SuperAdmin,
          Role.User,
          // Role.communityUser,
          
        ]
    
      },
      {
        id: 'user',
        title: 'Agency Workers',
        type: 'item',
        icon: 'lock',
        url: 'blockUser',
        // role : [Role.Community ]
      },
      {
        id: 'agencyBudget',
        title: 'Agency Budget',
        type: 'item',
        icon: 'credit-card',
        url: 'budget-agency',
        // role : [Role.Community]
      },
      {
        id: 'Agencyholiday',
        title: 'Agency Holiday',
        type: 'item',
        icon: 'award',
        url: 'agency-holiday',
        // role : [Role.Community]
      },
      {
        id: 'agencyRate',
        title: 'Agency Rates',
        type: 'item',
        icon: 'dollar-sign',
        url: 'agencyRate',
        // role : [Role.Community]
       },

        {
        id: 'Employee List',
        title: 'Employee List',
        type: 'item',
        icon: 'user',
        url: 'emp_user/employee-list',
       role : [Role.Community, Role.SuperAdmin]
      },
     
      // {
      //   id: 'community',
      //   title: 'Communities',
      //   type: 'item',
      //   icon: 'users',
      //   url: 'community',
      // //  role : [Role.SuperAdmin ]//
      // },
      // {
      //   id: 'community',
      //   title: 'Department',
      //   type: 'item',
      //   icon: 'home',
      //   url: 'department',
      //  // role : [Role.Community]
    
      // },
      // {
      //   id: 'management',
      //   title: 'Management <br> Company',
      //   type: 'item',
      //   icon: 'grid',
      //   url: 'management',
      //  // role:[ Role.SuperAdmin]
      // },
      // {
      //   id: 'span-trak',
      //   title: 'Menu',
      //   type: 'item',
      //   icon: 'anchor',
      //   url: 'menu',
       // role : [Role.SuperAdmin]
      // },
    //   {
    //     id: 'permission',
    //     title: 'Permissions',
    //     type: 'item',
    //     icon: 'unlock',
    //     url: 'permission',
    //   //  role : [Role.SuperAdmin]
    //   },
    //   {
    //     id: 'position',
    //     title: 'Position',
    //     type: 'item',
    //     icon: 'compass',
    //     url: 'position',
    //  //   role : [Role.Community]
    //   },
      {
        id: 'community',
        title: 'Reports',
        type: 'item',
        icon: 'clipboard',
        url: 'reports',
      //  role : [Role.Community, Role.SuperAdmin]
      },
     
      // {
      //   id: 'roles',
      //   title: 'Roles',
      //   type: 'item',
      //   icon: 'activity',
      //   url: 'roles',
      //  // role : [Role.SuperAdmin]
      // },
      
      {
        id: 'shift',
        title: 'Shifts',
        type: 'item',
        icon: 'layers',
        url: 'shift',
       // role:[Role.Community,Role.SuperAdmin]
      },
    
      {
        id: 'RequestedShifts',
        title: 'Requested Shifts',
        type: 'item',
        icon: 'layers',
        url: 're_shift/requested-shifts',
       role:[Role.User,Role.Agency]
      },

      // {
      //   id: 'user',
      //   title: 'User',
      //   type: 'item',
      //   icon: 'user',
      //   url: 'user',
      //   // role : [ ]
      // },
     
      
    ]

  },

  {
    id: 'SpendTrak',
    title: 'spendtrak',
    type: 'collapsible',
    icon: 'folder-plus',
    // url: 'community',
    // role : [Role.Community, Role.SuperAdmin,],
    access_to: ['spend_trak', 'both'],
    children : [
      // {
      //   id: 'agency',
      //   title: 'Contracts',
      //   type: 'item',
      //   icon: 'codesandbox',
      //   url: 'setup',
      //   role : [Role.Community,]
    
      // },
      // {
      //   id: 'agency',
      //   title: 'Departments',
      //   type: 'item',
      //   icon: 'codesandbox',
      //   url: 'setup',
      //  // role : [Role.Community,]
    
      // },
      // {
      //   id: 'agency',
      //   title: 'Departments Summary',
      //   type: 'item',
      //   icon: 'codesandbox',
      //   url: 'setup',
      //  // role : [Role.Community,]
    
      // },
      // {
      //   id: 'user',
      //   title: 'GL Codes',
      //   type: 'item',
      //   icon: 'user',
      //   url: 'setup',
      //  // role : [Role.Community]
    
      // },
      // {
      //   id: 'shift',
      //   title: 'Reports',
      //   type: 'item',
      //   icon: 'layers',
      //   url: 'setup',
      //  // role:[Role.Community]
      // },
      // {
      //   id: 'community',
      //   title: 'Spendb Down',
      //   type: 'item',
      //   icon: 'clipboard',
      //   url: 'setup',
      // //  role : [Role.Community]
      // },
      // {
      //   id: 'subscriptions',
      //   title: 'Subscriptions',
      //   type: 'item',
      //   icon: 'play-circle',
      //   url: 'subscriptions',
      // //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      // },
      // },
      // {
      //   id: 'shift',
      //   title: 'Reports',
      //   type: 'item',
      //   icon: 'layers',
      //   url: 'setup',
      //  // role:[Role.Community]
      // },
      // {
      //   id: 'community',
      //   title: 'Spendb Down',
      //   type: 'item',
      //   icon: 'clipboard',
      //   url: 'setup',
      // //  role : [Role.Community]
      // },
      // {
      //   id: 'subscriptions',
      //   title: 'Subscriptions',
      //   type: 'item',
      //   icon: 'play-circle',
      //   url: 'subscriptions',
      // //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      // },
      {
        id: 'budget',
        title: 'Budget',
        type: 'item',
        icon: 'disc',
        url: 'budget',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'budget resident days',
        title: 'Budget Resident Days',
        type: 'item',
        icon: 'crosshair',
        url: 'budget-resident-days',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'currency',
        title: 'Currency',
        type: 'item',
        icon: 'dollar-sign',
        url: 'currency',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'department-summary',
        title: 'Department Summary',
        type: 'item',
        icon: 'alert-triangle',
        url: 'department-summary',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'expense_type',
        title: 'Expense Type',
        type: 'item',
        icon: 'maximize-2',
        url: 'expense_type',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      // {
      //   id: 'fixed-expence-table',
      //   title: 'Fixed Expense Table',
      //   type: 'item',
      //   icon: 'maximize-2',
      //   url: 'fixed-expence-table',
      // //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      // },
      {
        id: 'general_ledger',
        title: 'General Ledger',
        type: 'item',
        icon: 'file-text',
        url: 'general_ledger',
      //  role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'payment_type',
        title: 'Payment Type',
        type: 'item',
        icon: 'credit-card',
        url: 'payment_type',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'spend_down',
        title: 'Spend Down',
        type: 'item',
        icon: 'activity',
        url: 'spend_down',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'spend_down',
        title: 'Spend For Other Departmet',
        type: 'item',
        icon: 'activity',
        url: 'spend-for-other-department',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
        {
        id: 'spendtrak-reports',
        title: 'spendtrak Reports',
        type: 'item',
        icon: 'activity',
        url: 'spendtrak-reports',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'vendor',
        title: 'Vendor List',
        type: 'item',
        icon: 'share-2',
        url: 'vendor',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      {
        id: 'vendor_contracts',
        title: 'Vendor Contracts',
        type: 'item',
        icon: 'share-2',
        url: 'vendor_contracts',
       // role : [ Role.SuperAdmin,Role.Admin,Role.Community]
      },
      // {
      //   id: 'user',
      //   title: 'User',
      //   type: 'item',
      //   icon: 'user',
      //   url: 'user',
      //   // role : [ ]
      // },
   ]
  },

  {
    id: 'SuperAdmin',
    title: 'Admin',
    type: 'collapsible',
    icon: 'folder-plus',
    // url: 'community',
    role : [ Role.SuperAdmin, Role.Agency, Role.Community,Role.Admin,Role.communityUser,Role.ManagementUser],
    // access_to: ['shift_trak', 'both'],
    children : [
      {
        id: 'certification',
        title: 'Certification',
        type: 'item',
        icon: 'align-justify',
        url: 'certification',
        // role : [Role.Community]
      },
      {
        id: 'community',
        title: 'Communities',
        type: 'item',
        icon: 'users',
        url: 'community',
      //  role : [Role.SuperAdmin ]
      },
      {
        id: 'community',
        title: 'Department',
        type: 'item',
        icon: 'home',
        url: 'department',
       role : [Role.SuperAdmin, Role.Community,Role.Admin,Role.communityUser,Role.ManagementUser]
    
      },
      // {
      //   id: 'community',
      //   title: 'Department List',
      //   type: 'item',
      //   icon: 'home',
      //   url: 'department-list',
      //  role : [Role.SuperAdmin, Role.Community,Role.Admin]
    
      // },
      {
        id: 'management',
        title: 'Management <br> Company',
        type: 'item',
        icon: 'grid',
        url: 'management',
       role:[ Role.SuperAdmin]
      },
      {
        id: 'management',
        title: 'Management User',
        type: 'item',
        icon: 'grid',
        url: 'management-user',
       role:[Role.SuperAdmin,Role.Admin]
      },
      {
        id: 'span-trak',
        title: 'Menu',
        type: 'item',
        icon: 'anchor',
        url: 'menu',
       role : [Role.SuperAdmin]
      },
      {
        id: 'permission',
        title: 'Permissions',
        type: 'item',
        icon: 'unlock',
        url: 'permission',
       role : [Role.Agency,Role.SuperAdmin, Role.Community,Role.Admin]
      },
      {
        id: 'position',
        title: 'Position',
        type: 'item',
        icon: 'compass',
        url: 'position',
       role : [Role.SuperAdmin, Role.Community,Role.Admin,Role.Agency,Role.communityUser]
      },
    
      {
        id: 'roles',
        title: 'Roles',
        type: 'item',
        icon: 'activity',
        url: 'roles',
       role : [Role.Agency,Role.SuperAdmin, Role.Community,Role.Admin]
      },
      {
        id: 'default',
        title: 'Default Roles',
        type: 'item',
        icon: 'git-branch',
        url: 'default-roles',
       role : [Role.SuperAdmin]
      },
      {
        id: 'user',
        title: 'Users',
        type: 'item',
        icon: 'user',
        url: 'user',
        role : [ Role.SuperAdmin, Role.Community,Role.Admin,Role.communityUser]
      },
      {
        id: 'notification',
        title: 'Notifications',
        type: 'item',
        icon: 'bell',
        url: 'admin-notifications',
       role : [ Role.Community,Role.Admin]
      },
      {
        id: 'subscriptions',
        title: 'Subscriptions',
        type: 'item',
        icon: 'play-circle',
        url: 'subscriptions',
      //  role : [ Role.SuperAdmin]
      },
      {
        id: 'settings',
        title: 'Settings',
        type: 'item',
        icon: 'play-circle',
        url: 'admin-settings',
      //  role : [ Role.SuperAdmin]
      },
    ]

  },
  

];


