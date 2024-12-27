import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShiftPopupComponent } from '../../EmployeePages/shift-popup/shift-popup.component';
import { EmployeeService } from '../../../../Services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { CoffeeService } from '../../../../coffee.service';

@Component({
  selector: 'app-supplier-popup',
  templateUrl: './supplier-popup.component.html',
  styleUrl: './supplier-popup.component.css',
})
export class SupplierPopupComponent implements OnInit {
  supplierData: any;

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ShiftPopupComponent>,
    private formBuilder: FormBuilder,
    private coffee: CoffeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.supplierData = this.data;

    this.form = this.formBuilder.group({
      name: [this.supplierData.info.name, [Validators.required]],
      contact_person: [
        this.supplierData.info.contact_person,
        [Validators.required],
      ],
      email: [
        this.supplierData.info.email,
        [Validators.required, Validators.email],
      ],
      phone: [this.supplierData.info.phone, [Validators.required]],
    });
  }

  closePopup() {
    this.ref.close();
  }

  closeAndSavePopup() {
    const formValue = this.form.value;

    if (this.supplierData.title == 'Added Supplier') {
      this.coffee.createdSupplier(formValue).subscribe((response) => {
        this.toastr.success('Successfully Added Supplier!', 'Success', {
          closeButton: true,
          timeOut: 3000,
        });
      });
    } else if (this.supplierData.title == 'Updated Supplier') {
      console.log(this.supplierData.info._id);
      this.coffee
        .updatedSupplier(this.supplierData.info._id, formValue)
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

    // this.ref.close();
    // const formValue = this.form.value;
    // if (this.employeeData.title == 'Created Shift') {
    //   //employee_id, shift_date, start_time, end_time
    //   this.employeeService
    //     .createEmployeeShift({
    //       employee_id: this.employeeData.currentEmployeeId,
    //       shift_date: formValue.date,
    //       start_time: formValue.startTime,
    //       end_time: formValue.endTime,
    //     })
    //     .subscribe((response) => {
    //       console.log(response);
    //       this.toastr.success('Successfully added Shift!', 'Success', {
    //         closeButton: true,
    //         timeOut: 3000,
    //       });
    //     });
    // } else if (this.employeeData.title == 'Updated Shift') {
    //   this.employeeService
    //     .updatedEmployeeShift(this.employeeData.shiftDate.shift_id, {
    //       employee_id: this.employeeData.currentEmployeeId,
    //       shift_date: formValue.date,
    //       start_time: formValue.startTime,
    //       end_time: formValue.endTime,
    //     })
    //     .subscribe((response) => {
    //       this.toastr.success('Successfully updated!', 'Success', {
    //         closeButton: true,
    //         timeOut: 3000,
    //       });
    //     });
    // }
  }
}
