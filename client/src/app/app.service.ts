import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Comparator } from "clarity-angular";

import { User, Role } from "./models/models.type";
import * as forge from "node-forge";

forge.options.usePureJavaScript = true;

@Injectable()
export class AppService {
  private _tokens: any;

  private _loading: boolean = false;

  public userRepo = new Repository<User>(this.http, this, "user");

  public roleRepo = new Repository<Role>(this.http, this, "role");

  public warningMessage: any;

  constructor(private http: Http) {
    let ts = localStorage.getItem("tokens");
    if (ts) {
      try {
        this._tokens = JSON.parse(ts);
      } catch (err) { }
    }
    // [].forEach(m => {
    //   this[`${m}Repo`] = new Repository<any>(this.http, this, m);
    // })
  }

  isLogin(): boolean {
    return !!this._tokens;
  }

  showWarning(msg) {
    this.warningMessage = msg;
  }

  clearWarning() {
    this.warningMessage = undefined;
  }

  get loading() {
    return this._loading;
  }

  set loading(v: boolean) {
    this._loading = v;
  }

  async login(user): Promise<any> {
    this._loading = true;
    try {
      let init: any = await this.authInit(user.name);
      this._tokens = await this.authLogin(init, user.name, user.password);
      localStorage.setItem("tokens", JSON.stringify(this._tokens));
      this._loading = false;
      return this._tokens;
    } catch (err) {
      this._loading = false;
      throw err;
    }
  }

  logout() {
    this._tokens = null;
    localStorage.removeItem("tokens");
  }

  get tokens(): any {
    return this._tokens;
  }

  set tokens(tokens) {
    console.log("SET TOKEN", tokens);
    this._tokens = tokens;
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(this._tokens));
    } else {
      localStorage.removeItem("tokens");
    }
  }

  get user(): any {
    if (this._tokens) return this._tokens.user;
    return null;
  }

  authInit(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/api/auth/${username}`).map(v => v.json()).subscribe(v => resolve(v), err => reject(err));
    });
  }

  authLogin(authInit, username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let hmac = forge.hmac.create();
      hmac.start('sha256', username);
      hmac.update(password);
      let bx = hmac.digest().getBytes();
      hmac.start('sha256', authInit.secret);
      hmac.update(bx);
      this.http.post(`/api/auth/${username}`, { secret: authInit.secret, password: forge.util.encode64(hmac.digest().getBytes()) }).map(v => v.json()).subscribe(v => resolve(v), err => reject(err));
    });
  }

  authRefresh(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/api/auth/${this.tokens.refreshToken}/refresh`).map(v => v.json()).subscribe(v => {
        this.tokens = v;
        localStorage.setItem("tokens", JSON.stringify(this.tokens));
        resolve(v)
      }, err => reject(err));
    });
  }
}

export class Repository<T> {
  constructor(private http: Http, private appSvc: AppService, private repoId: string) { }

  async _get(url: string): Promise<any> {
    try {
      let res = await new Promise((resolve, reject) => {
        this.http.get(url, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
          .subscribe(v => resolve(v), err => reject(err));
      });
      return res;
    } catch (err) {
      console.log(`\n\n_GET ERR ${url}`, err);
      if (err.status === 403 && typeof err._body === "string") {
        let retry = false;
        try {
          let ebody = JSON.parse(err._body);
          if (ebody.name === "TokenExpiredError") {
            console.log("NEED REFRESH TOKEN");
            let tokens = await new Promise((resolve, reject) => this.http.get(
              `/api/auth/${this.appSvc.tokens.refreshToken}/refresh/`,
              { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err)));
            console.log("NEW TOKENS", tokens);
            this.appSvc.tokens = tokens;
            retry = true;
          }
        } catch (err2) {
          console.log("Refresh token", err2);
          if (err2.status === 401) {
            this.appSvc.tokens = null;
            return null;
          }
        }
        if (retry) {
          let res = await new Promise((resolve, reject) => {
            this.http.get(url, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err));
          });
          return res;
        }
      }
      throw err;
    }
  }

  async _post(url: string, body: any): Promise<any> {
    try {
      let res = await new Promise((resolve, reject) => {
        this.http.post(url, body, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
          .map(v => v.json())
          .subscribe(v => resolve(v), err => reject(err));
      });
      return res;
    } catch (err) {
      console.log(`\n\n_GET ERR ${url}`, err);
      if (err.status === 403 && typeof err._body === "string") {
        let retry = false;
        try {
          let ebody = JSON.parse(err._body);
          if (ebody.name === "TokenExpiredError") {
            console.log("NEED REFRESH TOKEN");
            let tokens = await new Promise((resolve, reject) => this.http.get(
              `/api/auth/${this.appSvc.tokens.refreshToken}/refresh/`,
              { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err)));
            console.log("NEW TOKENS", tokens);
            this.appSvc.tokens = tokens;
            retry = true;
          }
        } catch (err2) {
          console.log("Refresh token", err2);
          if (err2.status === 401) {
            this.appSvc.tokens = null;
            return null;
          }
        }
        if (retry) {
          let res = await new Promise((resolve, reject) => {
            this.http.post(url, body, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
              .map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err));
          });
          return res;
        }
      }
      throw err;
    }
  }

  async _patch(url: string, body: any): Promise<any> {
    try {
      let res = await new Promise((resolve, reject) => {
        this.http.patch(url, body, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
          .map(v => v.json())
          .subscribe(v => resolve(v), err => reject(err));
      });
      return res;
    } catch (err) {
      console.log(`\n\n_GET ERR ${url}`, err);
      if (err.status === 403 && typeof err._body === "string") {
        let retry = false;
        try {
          let ebody = JSON.parse(err._body);
          if (ebody.name === "TokenExpiredError") {
            console.log("NEED REFRESH TOKEN");
            let tokens = await new Promise((resolve, reject) => this.http.get(
              `/api/auth/${this.appSvc.tokens.refreshToken}/refresh/`,
              { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err)));
            console.log("NEW TOKENS", tokens);
            this.appSvc.tokens = tokens;
            retry = true;
          }
        } catch (err2) {
          console.log("Refresh token", err2);
          if (err2.status === 401) {
            this.appSvc.tokens = null;
            return null;
          }
        }
        if (retry) {
          let res = await new Promise((resolve, reject) => {
            this.http.patch(url, body, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
              .map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err));
          });
          return res;
        }
      }
      throw err;
    }
  }

  async _delete(url: string): Promise<any> {
    try {
      let res = await new Promise((resolve, reject) => {
        this.http.delete(url, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
          .map(v => v.json())
          .subscribe(v => resolve(v), err => reject(err));
      });
      return res;
    } catch (err) {
      console.log(`\n\n_GET ERR ${url}`, err);
      if (err.status === 403 && typeof err._body === "string") {
        let retry = false;
        try {
          let ebody = JSON.parse(err._body);
          if (ebody.name === "TokenExpiredError") {
            console.log("NEED REFRESH TOKEN");
            let tokens = await new Promise((resolve, reject) => this.http.get(
              `/api/auth/${this.appSvc.tokens.refreshToken}/refresh/`,
              { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) }).map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err)));
            console.log("NEW TOKENS", tokens);
            this.appSvc.tokens = tokens;
            retry = true;
          }
        } catch (err2) {
          console.log("Refresh token", err2);
          if (err2.status === 401) {
            this.appSvc.tokens = null;
            return null;
          }
        }
        if (retry) {
          let res = await new Promise((resolve, reject) => {
            this.http.delete(url, { headers: new Headers({ Authorization: `Bearer ${this.appSvc.tokens.token}` }) })
              .map(v => v.json())
              .subscribe(v => resolve(v), err => reject(err));
          });
          return res;
        }
      }
      throw err;
    }
  }

  async refreshToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`/api/${this.appSvc.tokens.refreshToken}/refresh`).map(v => v.json()).subscribe(v => resolve(v), err => reject(err));
    });
  }

  async get(id: string): Promise<T> {
    let result: any = await this._get(`/api/${this.repoId}/${id}`);
    if (this.repoId === "user") {
      let roles = [{ id: "root", label: "ROOT" }];
      roles.push(...((await this._get(`/api/role?count=1000`) as any).list).map(v => { return { id: v.name, label: v.name } }));
      result.roles$master = roles;
    }
    return result;
  }

  async list(state: State): Promise<List<T>> {
    let queryp = `from=${state.page.from}`;
    if (state.page.size) {
      queryp += `&size=${state.page.size}`
    }
    if (state.sort && state.sort.by) {
      queryp += `&sort=${encodeURI(state.sort.by as string)}`;
      if (state.sort.reverse) {
        queryp += "&desc";
      }
    }
    if (state.filters) {
      state.filters.forEach((v: any) => {
        queryp += `&f:${encodeURI(v.property)}=${encodeURI(v.value)}`;
      });
    }
    let res = await this._get(`/api/${this.repoId}?${queryp}`);
    console.log("LIST RESULT", res);
    return res;
  }

  async update(item: T): Promise<T> {
    return await this._patch(`/api/${this.repoId}/${(item as any)._id}`, item);
  }

  async save(item: T): Promise<T> {
    return await this._post(`/api/${this.repoId}`, item);
  }

  async delete(val: string | T[]): Promise<T> {
    if (val instanceof String) {
      return await this._delete(`/api/${this.repoId}/${val}`);
    } else {
      return await this._post(`/api/${this.repoId}/delete`, val);
    }
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
