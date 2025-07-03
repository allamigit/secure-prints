
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { BciFbiBackgroundComponent } from './component/bci-fbi-background/bci-fbi-background.component';
import { ScheduleComponent } from './component/schedule/schedule.component';
import { RescheduleCancelComponent } from './component/reschedule-cancel/reschedule-cancel.component';
import { LoginComponent } from './component/login/login.component';
import { AppointmentComponent } from './component/appointment/appointment.component';
import { AppointmentGuard } from './guard/appointment.guard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    { 
        path: '', 
        component: AppComponent 
    },
    { 
        path: 'home', 
        component: HomeComponent 
    },
    { 
        path: 'about-us', 
        component: AboutUsComponent 
    },
    { 
        path: 'bci-fbi-background', 
        component: BciFbiBackgroundComponent 
    },
    { 
        path: 'privacy-policy', 
        component: PrivacyPolicyComponent 
    },
    { 
        path: 'schedule', 
        component: ScheduleComponent 
    },
    { 
        path: 'reschedule-cancel', 
        component: RescheduleCancelComponent 
    },
    { 
        path: 'reschedule-cancel/:appointmentId/:action', 
        component: RescheduleCancelComponent
    },
    { 
        path: 'admin', 
        component: LoginComponent 
    },
    { 
        path: 'appointment', 
        component: AppointmentComponent,
        canActivate: [AppointmentGuard]
    }
];
