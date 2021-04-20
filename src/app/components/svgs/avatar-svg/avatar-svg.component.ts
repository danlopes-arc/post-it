import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-avatar-svg',
  templateUrl: './avatar-svg.component.html',
  styleUrls: ['./avatar-svg.component.css']
})
export class AvatarSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
