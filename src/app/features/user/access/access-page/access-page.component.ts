import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/user/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { CreateUserDto } from 'src/app/shared/dto/user/create-user.dto';
import { LoginUserDto } from 'src/app/shared/dto/user/login-user.dto';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonList,
  IonImg,
} from '@ionic/angular/standalone';
import { SocketService } from '../../../../core/services/socket/socket.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-access-page',
  imports: [
    ReactiveFormsModule,
    LoadingComponent,
    ModalComponent,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonList,
    IonImg,
    RouterLink,
  ],
  templateUrl: './access-page.component.html',
  styleUrls: ['./access-page.component.scss'],
})
export class AccessPageComponent implements OnInit {
  public isRegisterActive = signal(false);
  public isLoading = signal(false);

  public hasError = signal(true);
  public showModal = signal(false);
  public modalMessage = signal('');

  private readonly socketService = inject(SocketService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly emailValidator = [
    '',
    [Validators.required, Validators.email],
  ];
  private readonly passwordValidator = [
    '',
    [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d@$!%*?&_#]{8,}$/
      ),
    ],
  ];

  public ngOnInit(): void {
    this.authService.disconnectUser();
  }

  public readonly loginForm = this.fb.group({
    email: this.emailValidator,
    password: this.passwordValidator,
  });

  public readonly createForm = this.fb.group({
    name: ['', Validators.required],
    email: this.emailValidator,
    password: this.passwordValidator,
  });

  public changeForm(): void {
    this.isRegisterActive.update((value) => !value);
  }

  public onSegmentChange(ev: any): void {
    const value = ev?.detail?.value;
    this.isRegisterActive.set(value == 'register');
  }

  public closeModal(): void {
    this.showModal.set(false);
  }

  public login(): void {
    this.userService.login(this.loginForm.value as LoginUserDto).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.updateUserData(response.user);
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: ({ error }) => {
        this.modalMessage.set(error.message);
        this.showModal.set(true);
        this.isLoading.set(false);
      },
    });
  }

  public create(): void {
    const dto = this.createForm.value as CreateUserDto;
    this.userService.create(dto).subscribe({
      next: () => {
        this.showModal.set(true);
        this.hasError.set(false);
        this.socketService.open(dto.email);
        this.socketService.on(
          'email-validated',
          this.onAccountValidated.bind(this)
        );
      },
      error: ({ error }) => {
        this.modalMessage.set(error.message);
        this.showModal.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private onAccountValidated(user: User): void {
    this.authService.updateUserData(user);
    this.router.navigate(['/']);
  }
}
