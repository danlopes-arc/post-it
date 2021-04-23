import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  isLoading = true;
  isClearLoading = false;
  isSeedDisabled = false;
  isSeedLoading = false;

  constructor(private database: DatabaseService,
              private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    const users = await this.database.users.find();
    if (users.length) {
      this.isSeedDisabled = true;
    }
    this.isLoading = false;
  }

  async onClear(): Promise<void> {
    this.isLoading = true;
    this.isClearLoading = true;
    await this.database.resetDatabase();
    this.isSeedDisabled = false;
    await this.auth.logout();
    this.isLoading = false;
    this.isClearLoading = false;
  }

  async onSeed(): Promise<void> {
    this.isLoading = true;
    this.isSeedLoading = true;
    await this.database.seed();
    this.isSeedDisabled = true;
    this.isLoading = false;
    this.isSeedLoading = false;
  }
}
