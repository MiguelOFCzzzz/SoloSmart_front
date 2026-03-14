import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolochatPage } from './solochat.page';

describe('SolochatPage', () => {
  let component: SolochatPage;
  let fixture: ComponentFixture<SolochatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolochatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
