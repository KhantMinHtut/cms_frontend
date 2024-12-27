import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../../../../coffee.service';
import { MatDialog } from '@angular/material/dialog';
import { SupplierPopupComponent } from '../supplier-popup/supplier-popup.component';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '../../../models/supplier';

@Component({
  selector: 'app-supplier-page',
  templateUrl: './supplier-page.component.html',
  styleUrl: './supplier-page.component.css',
})
export class SupplierPageComponent implements OnInit {
  suppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  supplierCount: number = 0;

  pageSize = 8;
  pages: any[] = [];
  currentPage: number = 1;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  supplierInfo = {
    name: '',
    contact_person: '',
    email: '',
    phone: '',
  };

  constructor(
    private coffee: CoffeeService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.coffee.getSuppliers().subscribe(async (response) => {
      this.suppliers = await response.suppliers;
      this.supplierCount = await response.count;

      this.coffee
        .getPaginatedSuppliers(this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.paginatedSuppliers = response.suppliers;
        });

      this.pagination();
    });
  }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.supplierCount; i++) {
      if (this.pageSize * i < this.supplierCount + this.pageSize) {
        this.pages.push(i);
        console.log(this.pages);
      }
    }
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;
    this.coffee
      .getPaginatedSuppliers(currentPage, this.pageSize)
      .subscribe((response) => {
        this.suppliers = response.suppliers;
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

    const filterName = this.suppliers.filter((supplier) => {
      return supplier.name
        ?.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterEmail = this.suppliers.filter((supplier) => {
      return supplier.email
        ?.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterPhone = this.suppliers.filter((supplier) => {
      return supplier.phone
        ?.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterContactPerson = this.suppliers.filter((supplier) => {
      return supplier.contact_person
        ?.toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    if (filterName.length > 0) {
      this.paginatedSuppliers = filterName;
    } else if (filterContactPerson.length > 0) {
      this.paginatedSuppliers = filterContactPerson;
    } else if (filterEmail.length > 0) {
      this.paginatedSuppliers = filterEmail;
    } else if (filterPhone.length > 0) {
      this.paginatedSuppliers = filterPhone;
    }
  }

  onChangePage() {}

  onDeletedSupplier(id: String) {
    this.coffee.deletedSupplier(id).subscribe((response) => {
      this.toastr.error('Deleted Supplier', 'Delete', {
        closeButton: true,
        timeOut: 3000,
      });
    });
    this.initData();
  }

  openPopup(title: String, info: any) {
    const _popup = this.dialog.open(SupplierPopupComponent, {
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
