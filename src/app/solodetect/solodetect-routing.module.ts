import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolodetectPage } from './solodetect.page';

const routes: Routes = [
  {
    path: '',
    component: SolodetectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolodetectPageRoutingModule {}
