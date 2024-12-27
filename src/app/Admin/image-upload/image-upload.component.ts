import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CoffeeService } from '../../coffee.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
})
export class ImageUploadComponent implements OnInit {
  form!: FormGroup;
  suppliers = [];
  categories = ['coffee', 'cake', 'latte'];

  constructor(private coffee: CoffeeService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(0),
      category: new FormControl(''),
      supplier: new FormControl(''),
      img_url: new FormControl(null),
    });

    this.getSuppliers();
  }

  selectedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      console.log('Selected file:', file);
      this.form.patchValue({ img_url: file });
    }
  }

  getSuppliers() {
    this.coffee.getSuppliers().subscribe(
      (response) => {
        console.log(typeof response.suppliers);
        this.suppliers = response.suppliers;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(value: any) {
    console.log(value);
    this.coffee.createProduct(value).subscribe((response) => {
      console.log(response);
    });
  }
}
