import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../components/home/home.component";
import { FormComponent as BookFormComponent } from "../components/book/form/form.component";
import { RegisterComponent } from "../components/register/register.component";
import { LoginComponent } from "../components/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { QuemSomosComponent } from "../components/quem-somos/quem-somos.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "book/form",
    component: BookFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quem-somos",
    component: QuemSomosComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  // otherwise redirect to home
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
