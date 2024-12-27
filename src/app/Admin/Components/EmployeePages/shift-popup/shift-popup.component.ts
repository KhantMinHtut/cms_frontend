import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { SupplierPopupComponent } from '../../SupplierPages/supplier-popup/supplier-popup.component';
import { EmployeeService } from '../../../../Services/employee.service';

@Component({
  selector: 'app-shift-popup',
  templateUrl: './shift-popup.component.html',
  styleUrl: './shift-popup.component.css',
})
export class ShiftPopupComponent implements OnInit {
  employeeData: any;

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SupplierPopupComponent>,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.employeeData = this.data;

    this.form = this.formBuilder.group({
      date: [this.employeeData.shiftDate.date, [Validators.required]],
      startTime: [this.employeeData.shiftDate.startTime, [Validators.required]],
      endTime: [this.employeeData.shiftDate.endTime, [Validators.required]],
    });
  }

  closePopup() {
    this.ref.close();
  }

  closeAndSavePopup() {
    this.ref.close();

    const formValue = this.form.value;

    if (this.employeeData.title == 'Created Shift') {
      //employee_id, shift_date, start_time, end_time
      this.employeeService
        .createEmployeeShift({
          employee_id: this.employeeData.currentEmployeeId,
          shift_date: formValue.date,
          start_time: formValue.startTime,
          end_time: formValue.endTime,
        })
        .subscribe((response) => {
          console.log(response);
          this.toastr.success('Successfully added Shift!', 'Success', {
            closeButton: true,
            timeOut: 3000,
          });
        });
    } else if (this.employeeData.title == 'Updated Shift') {
      this.employeeService
        .updatedEmployeeShift(this.employeeData.shiftDate.shift_id, {
          employee_id: this.employeeData.currentEmployeeId,
          shift_date: formValue.date,
          start_time: formValue.startTime,
          end_time: formValue.endTime,
        })
        .subscribe((response) => {
          this.toastr.success('Successfully updated!', 'Success', {
            closeButton: true,
            timeOut: 3000,
          });
        });
    }
  }
}
