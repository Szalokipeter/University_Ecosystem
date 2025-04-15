import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserModel, EditUserPayload } from '../../../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  editForm: any;
  isEditMode = false;
  private dialogRef = inject(MatDialogRef<UserFormComponent>);
  private data: { user?: UserModel } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasCapital = /[A-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasCapital) errors['missingCapital'] = true;
    if (!hasSpecial) errors['missingSpecial'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  constructor() {
    this.isEditMode = !!this.data?.user;

    if (this.isEditMode) {
      // Edit mode form - password is now required
      this.editForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidator,
          ],
        ],
        password_confirmation: ['', [Validators.required]],
      });

      this.editForm.patchValue({
        username: this.data.user?.username,
        password: '',
        password_confirmation: '',
      });
    } else {
      // Add mode form
      this.editForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidator,
          ],
        ],
        password_confirmation: ['', [Validators.required]],
      });
    }

    // Add cross-field validation for password confirmation
    this.editForm.get('password_confirmation')?.setValidators([
      Validators.required,
      (control: AbstractControl) => {
        return control.value === this.editForm?.get('password')?.value
          ? null
          : { mismatch: true };
      },
    ]);
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getPasswordErrors(): string[] {
    const errors = this.editForm.get('password')?.errors;
    if (!errors) return [];

    const messages: string[] = [];
    if (errors['required']) messages.push('Password is required');
    if (errors['minlength'])
      messages.push('Password must be at least 6 characters');
    if (errors['missingNumber'])
      messages.push('Password must contain at least 1 number');
    if (errors['missingCapital'])
      messages.push('Password must contain at least 1 capital letter');
    if (errors['missingSpecial'])
      messages.push('Password must contain at least 1 special character');

    return messages;
  }
}
