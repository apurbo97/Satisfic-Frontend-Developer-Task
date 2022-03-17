import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AddLeadComponent } from './components/add-lead/add-lead.component';
import { HomeComponent } from './components/home/home.component';
import { LeadDetailsComponent } from './components/lead-details/lead-details.component';
import { LeadListComponent } from './components/lead-list/lead-list.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:"", redirectTo:'login', pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard],
    children:[
      {path:'',component:LeadListComponent,pathMatch:'full',canActivate:[AuthGuard]},
      // {path:'details',component:LeadDetailsComponent,canActivate:[AuthGuard]},
      // {path:'addLead',component:AddLeadComponent,canActivate:[AuthGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
