import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { ApiResponseModel, UserModel, UserService } from '@app/core';
import { of, Observable, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-projects-dashboard',
  templateUrl: './all-projects-dashboard.component.html',
  styleUrls: ['./all-projects-dashboard.component.css']
})
export class AllProjectsDashboardComponent implements OnInit {
  username$ = this.auth.user$.pipe(map((user) => user?.nickname?.replace(/\b./g, x => x.toUpperCase())));
  id: number = -1;

  constructor(
    private auth: AuthService,
    public userApi: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIfNewUser();
    this.router.events.subscribe((event) => {
      this.id = Number(this.route.firstChild?.snapshot.params['id']) || -1;
    });
  }

  checkIfNewUser(): void {
    if (!this.userApi.userSub) {
      this.auth.user$.subscribe(user => {

        if (user) this.userApi.userSub = user?.sub || '';

        this.checkIfInDb().subscribe((isInDb => {
          if (!isInDb) this.saveToDb(user);
        }));
      })
    }
  }

  checkIfInDb(): Observable<boolean> {
    return this.userApi.getUser().pipe(
      switchMap((res: ApiResponseModel) => {
        return of(res.data ? true : false);
      }));
  }

  saveToDb(userData: User | null | undefined): void {
    if (userData) {
      const user: UserModel = {
        sub: userData.sub || '',
        firstName: userData.given_name || userData.name || '',
        lastName: userData.family_name || userData.name || '',
        nickname: userData.nickname || '',
        email: userData.email || '',
      }
      this.userApi.saveUser(user).subscribe();
    }
  }
}
