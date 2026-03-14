import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolochatPageRoutingModule } from './solochat-routing.module';

import { SolochatPage } from './solochat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolochatPageRoutingModule
  ],
  declarations: [SolochatPage]
})
export class SolochatPageModule {}
