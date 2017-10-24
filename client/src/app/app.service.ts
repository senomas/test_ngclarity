import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Comparator } from "clarity-angular";

import { User } from "./models/user.model";
import { Product } from "./models/product.model";
import { Params } from "./models/params.model";

@Injectable()
export class AppService {
  public user: any;

  public loading: boolean = false;

  public userRepo = new Repository<User>(this.http, "user");

  public productRepo = new Repository<Product>(this.http, "product");

  public paramsRepo = new Repository<Product>(this.http, "params");

  public warningMessage: any;

  constructor(private http: Http) { }

  isLogin(): boolean {
    return !!this.user;
  }

  showWarning(msg) {
    this.warningMessage = msg;
  }

  clearWarning() {
    this.warningMessage = undefined;
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
}

export class Repository<T> {
  constructor(private http: Http, private repoId: string) { }

  get(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`/api/${this.repoId}/${id}`)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(this.parseError(err)));
    });
  }

  list(state: State): Promise<List<T>> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`/api/${this.repoId}/find`, state)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(this.parseError(err)));
    });
  }

  update(item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .patch(`/api/${this.repoId}/${(item as any)._id}`, item)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(this.parseError(err)));
    });
  }

  save(item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`/api/${this.repoId}`, item)
        .map(v => v.json())
        .subscribe(v => resolve(v), err => reject(this.parseError(err)));
    });
  }

  delete(val: string | T[]): Promise<T> {
    console.log("DELETESSSS", val);
    if (val instanceof String) {
      return new Promise((resolve, reject) => {
        this.http
          .delete(`/api/${this.repoId}/${val}`)
          .map(v => v.json())
          .subscribe(v => resolve(v), err => reject(this.parseError(err)));
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http
          .post(`/api/${this.repoId}/delete`, val)
          .map(v => v.json())
          .subscribe(v => resolve(v), err => reject(this.parseError(err)));
      });
    }
  }

  parseError(err): any {
    try {
      let body = JSON.parse(err._body);
      if (body.message) {
        return body.message;
      }
    } catch (perr) {
      console.log("parseError", err, perr);
      return err;
    }
    return err;
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
