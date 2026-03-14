import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolodetectPageRoutingModule } from './solodetect-routing.module';

import { SolodetectPage } from './solodetect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolodetectPageRoutingModule
  ],
  declarations: [SolodetectPage]
})
export class SolodetectPageModule {}
