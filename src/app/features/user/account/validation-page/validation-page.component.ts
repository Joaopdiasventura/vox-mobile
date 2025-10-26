import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { AuthService } from '../../../../core/services/user/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../../../core/services/socket/socket.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-validation-page',
  templateUrl: './validation-page.component.html',
  styleUrls: ['./validation-page.component.scss'],
})
export class ValidationPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly socketService = inject(SocketService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit() {
    const email = this.route.snapshot.paramMap.get('email') as string;
    
  }

}
