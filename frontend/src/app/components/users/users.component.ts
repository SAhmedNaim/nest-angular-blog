import { UserData, UserService } from './../../services/user-service/user.service';
import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: UserData = null!;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      tap(users => console.log(users)),
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

}
