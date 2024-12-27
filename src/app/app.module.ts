import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ImageUploadComponent } from './Admin/image-upload/image-upload.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { LogoComponent } from './Admin/Components/logo/logo.component';
import { NavItemsComponent } from './Admin/Components/nav-items/nav-items.component';
import { NavBarComponent } from './Admin/Components/nav-bar/nav-bar.component';
import { HomePageComponent } from './Admin/Components/home-page/home-page.component';
import { ProductPageComponent } from './Admin/Components/ProductPages/product-page/product-page.component';
import { OrderPageComponent } from './Admin/Components/OrderPages/order-page/order-page.component';
import { AddPageComponent } from './Admin/Components/ProductPages/add-page/add-page.component';
import { ProductInfoPageComponent } from './Admin/Components/ProductPages/product-info-page/product-info-page.component';
import { OrderDetailsPageComponent } from './Admin/Components/OrderPages/order-details-page/order-details-page.component';
import { OrderViewPageComponent } from './Admin/Components/OrderPages/order-view-page/order-view-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Angular Materials

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'; // for matInput directive
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core'; // For native date support
import { MatIconModule } from '@angular/material/icon'; // For the icon button
import { MatButtonModule } from '@angular/material/button'; // For the button
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

// ngx-toastr
import { ToastrModule } from 'ngx-toastr';

// ChartsModule
import { NgChartsModule } from 'ng2-charts';

import { DatePipe, JsonPipe } from '@angular/common';
import { EmployeePageComponent } from './Admin/Components/EmployeePages/employee-page/employee-page.component';
import { EmployeeViewPageComponent } from './Admin/Components/EmployeePages/employee-view-page/employee-view-page.component';
import { EmployeeAddPageComponent } from './Admin/Components/EmployeePages/employee-add-page/employee-add-page.component';
import { EmployeeShiftComponent } from './Admin/Components/EmployeePages/employee-shift/employee-shift.component';
import { ShiftPopupComponent } from './Admin/Components/EmployeePages/shift-popup/shift-popup.component';
import { SupplierPageComponent } from './Admin/Components/SupplierPages/supplier-page/supplier-page.component';
import { SupplierPopupComponent } from './Admin/Components/SupplierPages/supplier-popup/supplier-popup.component';
import { CustomerPageComponent } from './Admin/Components/CustomerPages/customer-page/customer-page.component';
import { CustomerPopupComponent } from './Admin/Components/CustomerPages/customer-popup/customer-popup.component';

import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ImageUploadComponent,
    DashboardComponent,
    LogoComponent,
    NavItemsComponent,
    NavBarComponent,
    HomePageComponent,
    ProductPageComponent,
    OrderPageComponent,
    AddPageComponent,
    ProductInfoPageComponent,
    OrderDetailsPageComponent,
    OrderViewPageComponent,
    EmployeePageComponent,
    EmployeeViewPageComponent,
    EmployeeAddPageComponent,
    EmployeeShiftComponent,
    ShiftPopupComponent,
    SupplierPageComponent,
    SupplierPopupComponent,
    CustomerPageComponent,
    CustomerPopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),

    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule, // Provides date functions and formats
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,

    MatDatepickerModule,
    JsonPipe,

    NgChartsModule,
    NgxPrintModule,
  ],
  providers: [provideAnimationsAsync(), DatePipe, provideNativeDateAdapter()],
  bootstrap: [AppComponent],
})
export class AppModule {}
