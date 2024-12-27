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
      name: [this.customerData.info.name, [Validators.required]],

      email: [
        this.customerData.info.email,
        [Validators.required, Validators.email],
      ],
      phone: [this.customerData.info.phone, [Validators.required]],
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
      console.log(this.customerData.info._id);
      console.log(formValue);

      this.customerService
        .updatedCustomer(this.customerData.info._id, {
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          loyalty_points: parseInt(formValue.loyalty_points),
        })
        .subscribe((response) => {
          console.log(response);
          this.toastr.success('Successfully Updated Supplier!', 'Success', {
            closeButton: true,
            timeOut: 3000,
          });
        });
    }

    if (this.form.valid) {
      this.ref.close();
    }
  }
}
