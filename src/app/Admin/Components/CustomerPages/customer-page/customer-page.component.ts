import { Component } from '@angular/core';
import { CustomerPopupComponent } from '../customer-popup/customer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../../Services/customer.service';
import { Customer } from '../../../models/customer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css',
})
export class CustomerPageComponent {
  customers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  customerCount: number = 0;

  isPageLoading: boolean = false;
  submitted = false;

  changeForm: boolean = false;

  pageSize = 5;
  pages: any[] = [];
  currentPage: number = 1;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  selectedCustomer = {
    _id: '',
    name: '',
    email: '',
    phone: '',
    loyalty_points: 0,
  };

  mode: 'create' | 'update' = 'create';

  form!: FormGroup;
  formLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      name: [
        this.selectedCustomer.name,
        [Validators.required, Validators.minLength(3)],
      ],

      email: [
        this.selectedCustomer.email,
        [Validators.required, Validators.email],
      ],
      phone: [
        this.selectedCustomer.phone,
        [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
      ],
      loyalty_points: [this.selectedCustomer.loyalty_points],
    });
  }

  ngOnInit(): void {
    this.isPageLoading = true;
    this.initData();
  }

  initData() {
    this.customerService.getAllCutomers().subscribe(async (response) => {
      this.customers = await response.customers;
      this.customerCount = await response.count;

      this.customerService
        .getPaginatedCustomers(this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            // console.log(response);
            this.paginatedCustomers = response.paginatedCustomers;
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
    for (let i = 1; i < this.customerCount; i++) {
      if (this.pageSize * i < this.customerCount + this.pageSize) {
        this.pages.push(i);
        // console.log(this.pages);
      }
    }
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;
    this.customerService
      .getPaginatedCustomers(currentPage, this.pageSize)
      .subscribe((response) => {
        this.paginatedCustomers = response.paginatedCustomers;
        // console.log(response);
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

  onChangePage() {
    this.changeForm = false;
    this.submitted = false;
    this.mode = 'create';
    this.form.reset();
  }

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

  onUpdateCustomer(customer: Customer) {
    this.selectedCustomer = {
      _id: customer._id || '',
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      loyalty_points: customer.loyalty_points || 0,
    };

    this.form.patchValue({
      name: this.selectedCustomer.name,
      email: this.selectedCustomer.email,
      phone: this.selectedCustomer.phone,
      loyalty_points: this.selectedCustomer.loyalty_points,
    });

    this.changeForm = true;
    this.mode = 'update';
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
      if (this.mode == 'create') {
        this.customerService.createCustomer(formValue).subscribe({
          next: async (response) => {
            this.toastr.success('Successfully Added Customer!', 'Success', {
              closeButton: true,
              timeOut: 3000,
            });

            this.initData();
            this.formLoading = false;
            this.form.reset();
            this.changeForm = false;
          },
          error: (err) => {
            this.formLoading = false;
          },
        });
      } else if (this.mode == 'update') {
        // console.log(this.selectedCustomer._id);
        // console.log(formValue);

        this.customerService
          .updatedCustomer(this.selectedCustomer._id, {
            name: formValue.name,
            email: formValue.email,
            phone: formValue.phone,
            loyalty_points: parseInt(formValue.loyalty_points),
          })
          .subscribe({
            next: async (response) => {
              // console.log(response);

              this.toastr.success('Successfully Updated Customer!', 'Success', {
                closeButton: true,
                timeOut: 3000,
              });

              this.customerService
                .getPaginatedCustomers(this.currentPage, this.pageSize)
                .subscribe({
                  next: (response) => {
                    this.paginatedCustomers = response.paginatedCustomers;

                    this.formLoading = false;
                    this.changeForm = false;
                    this.form.reset();
                  },
                  error: (error) => {
                    this.formLoading = false;
                  },
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
      } else if (invalidFields.length == 2) {
        invalidMessage =
          'Please correct the fields:' +
          invalidFields.map((f: string) => `${f}`).join(' , ');
      } else if (invalidFields.length == 3) {
        invalidMessage = 'Please fill all required fields correctly.';
      }

      this.toastr.error(invalidMessage, 'Form Validation Error', {
        closeButton: true,
        timeOut: 3000,
      });
    }
  }
}
