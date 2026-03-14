import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolochatPage } from './solochat.page';

const routes: Routes = [
  {
    path: '',
    component: SolochatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolochatPageRoutingModule {}
