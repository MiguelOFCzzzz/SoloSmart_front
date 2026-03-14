import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloIAPage } from './soloia.page';
import { IonicModule } from '@ionic/angular';

describe('SoloIAPage', () => {
  let component: SoloIAPage;
  let fixture: ComponentFixture<SoloIAPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoloIAPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoloIAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});