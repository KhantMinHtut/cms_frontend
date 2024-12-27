import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../Services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../models/employee';
import { CoffeeService } from '../../../../coffee.service';

@Component({
  selector: 'app-employee-add-page',
  templateUrl: './employee-add-page.component.html',
  styleUrl: './employee-add-page.component.css',
})
export class EmployeeAddPageComponent implements OnInit {
  @Input() clickedBtn: String = 'create';
  @Input() employee!: Employee;
  @Input() editUser!: Boolean;
  @Output() hideEditUser = new EventEmitter();
  @Output() changePage = new EventEmitter();

  form!: any;
  isPasswordVisible: boolean = false;
  visibleIcon: String = 'visibility_off';
  imageUrl: String = '../../../../../assets/images/image-upload2.png';

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private coffee: CoffeeService
  ) {}

  ngOnInit(): void {
    this.initForm(this.employee);
  }

  initForm(employee: Employee) {
    this.imageUrl =
      employee.image_url ||
      '../../../../../assets/images/employee placeholder.png';
    this.form = this.formBuilder.group({
      image_url: [this.imageUrl],
      name: [employee.name, Validators.required],
      email: [employee.email, [Validators.required, Validators.email]],
      phone: [employee.phone, Validators.required],
      password: [
        employee.password,
        [Validators.required, Validators.minLength(6)],
      ],
      position: [employee.position, Validators.required],
      salary: [employee.salary, Validators.required],
      hire_date: [employee.hire_date, Validators.required],
      location: [employee.location, Validators.required],
      role: [employee.role?.toString() || '0'],
    });
  }

  selectedImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      console.log('Selected file:', file);
      this.form.patchValue({ image_url: file });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
    }
  }

  onChangePage() {
    console.log(this.editUser);
    this.editUser
      ? this.hideEditUser.emit(true)
      : this.changePage.emit({ page: 'view-page', data: {}, clickBtn: '' });
  }

  onPasswordVisible() {
    this.visibleIcon = this.isPasswordVisible ? 'visibility_off' : 'visibility';
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(formValue: any, fileInput: HTMLInputElement) {
    console.log(formValue);

    if (this.clickedBtn == 'create') {
      this.employeeService.createEmployee(formValue).subscribe((response) => {
        console.log(response);
        this.toastr.success('Successfully added employee!', 'Success', {
          closeButton: true,
          timeOut: 3000,
        });
      });
    } else if (this.clickedBtn == 'update') {
      this.employeeService
        .updatedEmployee(this.employee._id!, formValue)
        .subscribe((response) => {
          console.log(response);
          this.toastr.success('Successfully updated employee!', 'Success', {
            closeButton: true,
            timeOut: 3000,
          });
        });
    }

    this.form.reset();
    if (fileInput) {
      fileInput.value = '';
    }
    this.imageUrl = '../../../../../assets/images/image-upload2.png';
  }
}
