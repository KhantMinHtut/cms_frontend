import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../../../../coffee.service';
import { MatDialog } from '@angular/material/dialog';
import { SupplierPopupComponent } from '../supplier-popup/supplier-popup.component';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '../../../models/supplier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-supplier-page',
  templateUrl: './supplier-page.component.html',
  styleUrl: './supplier-page.component.css',
})
export class SupplierPageComponent implements OnInit {
  suppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  supplierCount: number = 0;

  isPageLoading: boolean = false;

  pageSize = 5;
  pages: any[] = [];
  currentPage: number = 1;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  supplierInfo = {
    _id: '',
    name: '',
    contact_person: '',
    email: '',
    phone: '',
  };

  isCreateMode: boolean = true;

  form: FormGroup;

  changeForm: boolean = false;
  formLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private coffee: CoffeeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: [
        this.supplierInfo.name,
        [Validators.required, Validators.minLength(3)],
      ],
      contact_person: [this.supplierInfo.contact_person, [Validators.required]],
      email: [this.supplierInfo.email, [Validators.required, Validators.email]],
      phone: [
        this.supplierInfo.phone,
        [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
      ],
    });
  }

  ngOnInit(): void {
    this.isPageLoading = true;
    this.initData();
  }

  initData() {
    this.coffee.getSuppliers().subscribe(async (response) => {
      this.suppliers = await response.suppliers;
      this.supplierCount = await response.count;

      this.coffee
        .getPaginatedSuppliers(this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.paginatedSuppliers = response.suppliers;
            setTimeout(() => {
              this.isPageLoading = false;
            }, 1000);
          },
          error: (error) => {
            setTimeout(() => {
              this.isPageLoading = false;
            }, 5000);
          },
        });

      this.pagination();
    });
  }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.supplierCount; i++) {
      if (this.pageSize * i < this.supplierCount + this.pageSize) {
        this.pages.push(i);
        // console.log(this.pages);
      }
    }
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;
    this.coffee
      .getPaginatedSuppliers(currentPage, this.pageSize)
      .subscribe((response) => {
        this.paginatedSuppliers = response.suppliers;
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

  onChangePage() {
    this.changeForm = false;
    this.submitted = false;
    this.form.reset();
  }

  onUpdateSupplier(supplier: Supplier) {
    this.supplierInfo = {
      _id: supplier._id || '',
      name: supplier.name || '',
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    };

    this.form.patchValue({
      name: this.supplierInfo.name,
      contact_person: this.supplierInfo.contact_person,
      email: this.supplierInfo.email,
      phone: this.supplierInfo.phone,
    });

    this.changeForm = true;
    this.isCreateMode = false;
  }

  onDeletedSupplier(id: String) {
    this.coffee.deletedSupplier(id).subscribe((response) => {
      this.toastr.error('Deleted Supplier', 'Delete', {
        closeButton: true,
        timeOut: 3000,
      });

      this.paginatedSuppliers = this.paginatedSuppliers.filter(
        (supplier) => supplier._id != id
      );

      if (this.paginatedSuppliers.length == 0) {
        this.currentPage--;
      }

      this.initData();
    });
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

  getAllInvalidControls(form = this.form) {
    const invalid: any = [];

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);

      if (control instanceof FormGroup) {
        invalid.push(...this.getAllInvalidControls(control));
      } else if (control?.invalid) {
        invalid.push(key);
      }
    });

    return invalid;
  }

  onSubmit() {
    const formValue = this.form.value;

    if (this.form.valid) {
      this.formLoading = true;
      if (this.isCreateMode) {
        this.coffee.createdSupplier(formValue).subscribe({
          next: (response) => {
            this.toastr.success('Successfully Added Supplier!', 'Success', {
              closeButton: true,
              timeOut: 3000,
            });

            this.formLoading = false;
            this.changeForm = false;
            this.form.reset();

            this.coffee.getSuppliers().subscribe(async (response) => {
              this.suppliers = await response.suppliers;
              this.supplierCount = await response.count;

              this.coffee
                .getPaginatedSuppliers(this.currentPage, this.pageSize)
                .subscribe({
                  next: (response) => {
                    this.paginatedSuppliers = response.suppliers;
                  },
                  error: (error) => {},
                });

              this.pagination();
            });
          },
          error: (err) => {
            this.formLoading = false;
          },
        });
      } else {
        this.coffee
          .updatedSupplier(this.supplierInfo._id, formValue)
          .subscribe({
            next: (response) => {
              // console.log(response);
              this.toastr.success('Successfully Updated Supplier!', 'Success', {
                closeButton: true,
                timeOut: 3000,
              });

              this.formLoading = false;
              this.changeForm = false;
              this.form.reset();

              this.coffee
                .getPaginatedSuppliers(this.currentPage, this.pageSize)
                .subscribe({
                  next: (response) => {
                    this.paginatedSuppliers = response.suppliers;
                  },
                  error: (error) => {},
                });
            },
            error: (err) => {
              this.formLoading = false;
            },
          });
      }
    } else {
      this.submitted = true;

      const invalidFields = this.getAllInvalidControls();
      let invalidMessage = '';

      if (invalidFields.length == 1) {
        invalidMessage = `Please correct the field: ${invalidFields[0]}`;
      } else if (invalidFields.length > 1 && invalidFields.length < 4) {
        invalidMessage =
          'Please correct the fields:' +
          invalidFields.map((f: string) => `${f}`).join(' , ');
      } else if (invalidFields.length == 4) {
        invalidMessage = 'Please fill all required fields correctly.';
      }

      this.toastr.error(invalidMessage, 'Form Validation Error', {
        closeButton: true,
        timeOut: 3000,
      });
    }
  }
}
