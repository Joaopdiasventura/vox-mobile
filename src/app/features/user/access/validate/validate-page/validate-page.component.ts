import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { UserService } from '../../../../../core/services/user/user.service';
import { AuthService } from '../../../../../core/services/user/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  imports: [IonButton, LoadingComponent, ModalComponent],
  selector: 'app-validate-page',
  templateUrl: './validate-page.component.html',
  styleUrls: ['./validate-page.component.scss'],
})
export class ValidatePageComponent implements OnInit {
  public isLoading = signal(true);
  public showModal = signal(false);
  public modalMessage = signal('');

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') as string;
    this.userService.validateAccount(token).subscribe({
      next: (user) => {
        this.authService.updateUserData(user);
        this.router.navigate(['/']);
      },
      error: ({ error }) => {
        this.modalMessage.set(error.message);
        this.showModal.set(true);
        this.isLoading.set(false);
      },
    });
  }

  public closeModal(): void {
    this.router.navigate(['/', 'user', 'access']);
  }
}
