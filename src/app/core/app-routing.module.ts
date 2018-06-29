import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../components/home/home.component";
import { QuemSomosComponent } from "../components/quem-somos/quem-somos.component";
import { FormComponent as BookFormComponent } from "../components/book/form/form.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "book/form",
    component: BookFormComponent
  },
  {
    path: "quem-somos",
    component: QuemSomosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
