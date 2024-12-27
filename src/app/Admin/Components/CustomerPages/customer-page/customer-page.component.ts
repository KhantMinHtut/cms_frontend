import { Component } from '@angular/core';
import { CustomerPopupComponent } from '../customer-popup/customer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../../Services/customer.service';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css',
})
export class CustomerPageComponent {
  customers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  customerCount: number = 0;

  pageSize = 4;
  pages: any[] = [];
  currentPage: number = 1;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  newCustomer = {
    name: '',
    email: '',
    phone: '',
    loyalty_points: 0,
  };

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.customerService.getAllCutomers().subscribe(async (response) => {
      this.customers = await response.customers;
      this.customerCount = await response.count;

      this.customerService
        .getPaginatedCustomers(this.currentPage, this.pageSize)
        .subscribe((response) => {
          console.log(response);
          this.paginatedCustomers = response.paginatedCustomers;
        });

      this.pagination();
    });
  }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.customerCount; i++) {
      if (this.pageSize * i < this.customerCount + this.pageSize) {
        this.pages.push(i);
        console.log(this.pages);
      }
    }
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;
    this.customerService
      .getPaginatedCustomers(currentPage, this.pageSize)
      .subscribe((response) => {
        this.paginatedCustomers = response.paginatedCustomers;
        console.log(response);
      });
  }

  searchBox(value: String) {
    if (value == 'open') {
      this.searchIcon = 'd-none';
      this.searchInput = 'd-inline-block';
    } else {
      setTimeout(() => {
        this.searchIcon = 'd-inline-block';
        this.searchInput = 'd-none';
      }, 1000);
    }
  }

  onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    const filterName = this.customers.filter((customer) => {
      return customer
        .name!.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterEmail = this.customers.filter((customer) => {
      return customer
        .email!.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterPhone = this.customers.filter((customer) => {
      return customer.phone!.startsWith(inputValue);
    });

    const filterLoyaltyPoint = this.customers.filter((customer) => {
      return customer.loyalty_points!.toString().startsWith(inputValue);
    });

    if (filterName.length > 0) {
      this.paginatedCustomers = filterName;
    } else if (filterEmail.length > 0) {
      this.paginatedCustomers = filterEmail;
    } else if (filterPhone.length > 0) {
      this.paginatedCustomers = filterPhone;
    } else if (filterLoyaltyPoint.length > 0) {
      this.paginatedCustomers = filterLoyaltyPoint;
    }
  }

  onChangePage() {}

  onDeletedCustomer(id: String) {
    this.customerService.deleteOneCustomer(id).subscribe((response) => {
      this.toastr.error('Deleted Supplier', 'Delete', {
        closeButton: true,
        timeOut: 3000,
      });
    });
    this.initData();
  }

  openPopup(title: String, info: any) {
    const _popup = this.dialog.open(CustomerPopupComponent, {
      width: '60%',

      data: {
        title: title,
        info: info,
      },
    });

    _popup.afterClosed().subscribe((item) => {
      this.initData();
    });
  }
}
