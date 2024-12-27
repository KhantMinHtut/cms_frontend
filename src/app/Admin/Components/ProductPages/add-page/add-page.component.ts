import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CoffeeService } from '../../../../coffee.service';
import { Product } from '../../../models/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddPageComponent implements OnInit {
  @Input() data: Product = {};
  @Input() currentBtn: String = '';
  @Output() changePage = new EventEmitter();

  form!: FormGroup;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {};

  imageUrl: String = '../../../../../assets/images/image-upload2.png';

  constructor(
    private formBuilder: FormBuilder,
    private coffee: CoffeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm(this.data);

    // this.form = this.formBuilder.group({
    //   image_url: [],
    //   ingredients: [],
    //   name: [],
    //   price: [],
    //   quantity: [],
    //   origin: [],
    //   discount: [],
    //   reorderlevel: [],
    //   category: ['coffee'],
    //   suppliers: [],
    //   description: [],
    // });

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' },
    // ];

    this.coffee.getSuppliers().subscribe(async (response) => {
      const dropdownData: any[] = [];
      await response.suppliers.forEach((doc: any) => {
        dropdownData.push({
          item_id: doc._id,
          item_text: doc.name,
        });
      });
      this.dropdownList = dropdownData;
    });

    this.data.supplier_id?.forEach((id: String) => {
      this.coffee.getSupplier(id).subscribe((response) => {
        this.selectedItems.push({
          item_id: id,
          item_text: response.supplier.name,
        });
        this.form.patchValue({ suppliers: this.selectedItems });
      });
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  initForm(product: any) {
    this.imageUrl =
      product.image_url || '../../../../../assets/images/image-upload2.png';
    this.form = this.formBuilder.group({
      image_url: [this.imageUrl, Validators.required],
      ingredients: [product.ingredients],
      name: [product.name, Validators.required],
      price: [
        product.price,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      quantity: [
        product.stock_quantity,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      origin: [product.origin, [Validators.required]],
      discount: [
        product.discount,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      reorderlevel: [
        product.reorderlevel,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      category: [product.category, Validators.required],
      suppliers: ['', Validators.required],
      description: [product.description],
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
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

  onCreateProduct(formValue: any, fileInput: HTMLInputElement) {
    console.log(formValue);
    if (this.currentBtn == 'create') {
      this.coffee.createProduct(formValue).subscribe((response) => {
        console.log(response);
        this.toastr.success('Successfully added product!', 'Success', {
          closeButton: true,
          timeOut: 3000,
        });
      });
      console.log(this.currentBtn);
    } else {
      console.log(this.data._id);
      console.log(this.currentBtn);
      this.coffee
        .updateProduct(this.data._id, formValue)
        .subscribe((response) => {
          console.log(response);
          this.toastr.success('Successfully updated product!', 'Success', {
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

    this.changePage.emit({ page: 'info-page', data: {}, clickBtn: 'ok' });
  }

  onChangePage() {
    this.changePage.emit({ page: 'info-page', data: {}, clickBtn: 'ok' });
  }
}
