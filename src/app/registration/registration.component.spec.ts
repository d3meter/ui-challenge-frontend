import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { AuthService } from '../auth/auth.service';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [HttpClientModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with all fields empty and invalid', () => {
    expect(component.postForm.valid).toBeFalsy();
    expect(component.postForm.get('username').value).toEqual('');
    expect(component.postForm.get('username').valid).toBeFalsy();
    expect(component.postForm.get('email').value).toEqual('');
    expect(component.postForm.get('email').valid).toBeFalsy();
    expect(component.postForm.get('password').value).toEqual('');
    expect(component.postForm.get('password').valid).toBeFalsy();
    expect(component.postForm.get('confirm_password').value).toEqual('');
    expect(component.postForm.get('confirm_password').valid).toBeFalsy();
  });

  it('should show error message for invalid input: username', () => {
    component.postForm.get('username').setValue('a a');
    component.postForm.get('username').markAsTouched();
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.invalid-feedback')).nativeElement
        .innerText
    ).toContain('Username cannot contain spaces.');
  });

  it('should show error message for invalid input: email', () => {
    component.postForm.get('email').setValue('invalid_email');
    component.postForm.get('email').markAsTouched();
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.invalid-feedback')).nativeElement
        .innerText
    ).toContain('Invalid email format.');
  });

  it('should show error message for invalid input: password', () => {
    component.postForm.get('password').setValue('short');
    component.postForm.get('password').markAsTouched();
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.invalid-feedback')).nativeElement
        .innerText
    ).toContain('Password must be at least 6 characters long.');
  });

  it('should show error message for invalid input: password_confirm', () => {
    component.postForm.get('confirm_password').setValue('mismatch');
    component.postForm.get('confirm_password').markAsTouched();
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.invalid-feedback')).nativeElement
        .innerText
    ).toContain('Passwords do not match.');
  });

  it('should display the loading spinner when the form is submitting', () => {
    component.isLoading = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('img[src="assets/imgs/loadingClock.gif"]')
      )
    ).toBeTruthy();
  });

  it('should display the success message when the form submission is successful', () => {
    component.isLoading = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h4'))).toBeTruthy();
  });
});
