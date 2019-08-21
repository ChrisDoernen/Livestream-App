import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationComponent } from "./navigation.component";
import { AngularMaterialModule } from "../../angular-material.module";
import { ShutdownComponent } from "../shutdown/shutdown.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LogoComponent } from "../logo/logo.component";
import { InlineSVGDirective } from "ng-inline-svg";
import { InlineSVGService } from "ng-inline-svg/lib/inline-svg.service";
import { EndpointService } from "@live/services";
import createMockInstance from "jest-create-mock-instance";

describe("NavigationComponent", () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let endpointService: jest.Mocked<EndpointService>;

  beforeEach(() => {
    endpointService = createMockInstance(EndpointService);

    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        NavigationComponent,
        ShutdownComponent,
        LogoComponent,
        InlineSVGDirective
      ],
      providers: [
        { provide: InlineSVGService, useValue: jest.fn() },
        { provide: EndpointService, useValue: endpointService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
