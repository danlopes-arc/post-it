import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../models/User';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  constructor() {
  }

  @Input() user: User | null = null;
  @Input() isUndoAction = false;
  @Input() doActionName = 'do';
  @Input() undoActionName = 'undo';

  @Input() onDo = (user: User) => null as any;
  @Input() onUndo = (user: User) => null as any;

  ngOnInit(): void {
  }

}
