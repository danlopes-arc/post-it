import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-people-svg',
  templateUrl: './people-svg.component.html',
  styleUrls: ['./people-svg.component.css']
})
export class PeopleSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
