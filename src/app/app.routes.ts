import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { BciBackgroundComponent } from './component/bci-background/bci-background.component';
import { FbiBackgroundComponent } from './component/fbi-background/fbi-background.component';
import { ScheduleComponent } from './component/schedule/schedule.component';
import { RescheduleCancelComponent } from './component/reschedule-cancel/reschedule-cancel.component';
import { LoginComponent } from './component/login/login.component';
import { AdminComponent } from './component/admin/admin.component';

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
        path: 'privacy-policy', 
        component: PrivacyPolicyComponent 
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
        path: 'bci-background', 
        component: BciBackgroundComponent 
    },
    { 
        path: 'fbi-background', 
        component: FbiBackgroundComponent 
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
        path: 'admin', 
        component: LoginComponent 
    },
    { 
        path: 'admin-page', 
        component: AdminComponent 
    }
];
