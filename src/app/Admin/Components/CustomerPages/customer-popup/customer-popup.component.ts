import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../../Services/customer.service';

@Component({
  selector: 'app-customer-popup',
  templateUrl: './customer-popup.component.html',
  styleUrl: './customer-popup.component.css',
})
export class CustomerPopupComponent implements OnInit {
  customerData: any;

  form!: FormGroup;
  formLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CustomerPopupComponent>,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.customerData = this.data;

    this.form = this.formBuilder.group({
      name: [
        this.customerData.info.name,
        [Validators.required, Validators.minLength(3)],
      ],

      email: [
        this.customerData.info.email,
        [Validators.required, Validators.email],
      ],
      phone: [
        this.customerData.info.phone,
        [Validators.required, Validators.pattern(/^(?:09|\+959)\d{7,}$/)],
      ],
      loyalty_points: [this.customerData.info.loyalty_points],
    });
  }

  closePopup() {
    this.ref.close();
  }

  closeAndSavePopup() {
    const formValue = this.form.value;

    if (this.customerData.title == 'Added Customer') {
      this.customerService.createCustomer(formValue).subscribe((response) => {
        this.toastr.success('Successfully Added Supplier!', 'Success', {
          closeButton: true,
          timeOut: 3000,
        });
      });
    } else if (this.customerData.title == 'Updated Customer') {
      // console.log(this.customerData.info._id);
      // console.log(formValue);

      this.customerService
        .updatedCustomer(this.customerData.info._id, {
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          loyalty_points: parseInt(formValue.loyalty_points),
        })
        .subscribe((response) => {
          // console.log(response);
          this.toastr.success('Successfully Updated Supplier!', 'Success', {
            closeButton: true,
            timeOut: 3000,
          });
        });
    }

    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
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
      setTimeout(() => {
        this.toastr.success('Successfully Added Customer!', 'Success', {
          closeButton: true,
          timeOut: 3000,
        });

        this.formLoading = false;
        this.ref.close(this.form.value);
        this.form.reset();
      }, 1000);
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
        timeOut: 2000,
      });
    }
  }
}
