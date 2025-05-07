import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { TaskService } from '../../services/task.service';
import { TaskApiService } from '../../services/task-api.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-category.component.html',
  styleUrls: [
    './add-category.component.scss',
    './add-category-responsive.component.scss',
  ]
})
export class AddCategoryComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validate: ValidationService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,
    private taskApiService: TaskApiService
  ) {
    this.categoryForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.validate.validateCategory]),
    })
  }

  async onSubmit() {
    const formValue = this.categoryForm.value;
    let category = await this.taskApiService.createCategory(formValue);
    this.taskService.loadCategories();
    this.sharedService.closeAll();
    this.sharedService.isAdding = true;
    this.sharedService.isAddCategoryText = true;
    this.cdr.detectChanges();
    if (category) {
      setTimeout(() => {
        this.sharedService.setAllAddingTextOnFalse();
      }, 1000);
    }
  }


  cancel() {
    this.sharedService.closeAll();
  }
}
