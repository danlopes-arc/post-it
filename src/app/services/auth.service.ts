import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User | null = null;

  constructor(private database: DatabaseService) {
    this.init();
  }

  private async init(): Promise<void> {
    const username = localStorage.getItem('username');
    if (!username) {
      return;
    }
    await this.login(username);
  }

  async getUser(): Promise<User | null> {
    if (!this._user) {
      await this.init();
    }
    return this._user;
  }

  async login(username: string): Promise<boolean> {
    const user = (await this.database.users.find({username}))[0];
    if (!user) {
      localStorage.removeItem('username');
      return false;
    }
    this._user = user;
    localStorage.setItem('username', username);
    return true;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('username');
    this._user = null;
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    return !!(await this.database.users.find({username}));
  }
}
