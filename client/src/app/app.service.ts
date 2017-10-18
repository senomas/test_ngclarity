import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Comparator } from "clarity-angular";

@Injectable()
export class AppService {
  public user: any;

  public loading: boolean = false;

  constructor(private http: Http) {}

  isLogin(): boolean {
    return !!this.user;
  }

  login(user): Promise<any> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user = user;
        resolve(this.user);
        this.loading = false;
      }, 1000);
    });
  }

  getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`/api/user/${id}`)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(err));
    });
  }

  getUsers(state: State): Promise<List<User>> {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/user/find", state)
        .map(v => v.json())
        .subscribe(
          v => {
            console.log("RESULT:", v);
            resolve(v);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  updateUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http
        .patch(`/api/user/${(user as any)._id}`, user)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(err));
    });
  }

  saveUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`/api/user`, user)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(err));
    });
  }
}

export interface List<T> {
  start: number;
  total: number;
  list: T[];
}

export interface State {
  page?: {
    from?: number;
    to?: number;
    size?: number;
  };
  sort?: {
    by: string | Comparator<any>;
    reverse: boolean;
  };
  filters?: ({ property: string; value: string } | Filter<any>)[];
}

export interface Filter<T> {
  isActive(): boolean;
  accepts(item: T): boolean;
  changes: Observable<any>;
}

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}
