import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotficationsComponent } from "./notfications.component";
import { AngularMaterialModule } from "../../angular-material.module";

describe("NotficationsComponent", () => {
  let component: NotficationsComponent;
  let fixture: ComponentFixture<NotficationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule
      ],
      declarations: [
        NotficationsComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotficationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});