import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolodetectPage } from './solodetect.page';

describe('SolodetectPage', () => {
  let component: SolodetectPage;
  let fixture: ComponentFixture<SolodetectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolodetectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
