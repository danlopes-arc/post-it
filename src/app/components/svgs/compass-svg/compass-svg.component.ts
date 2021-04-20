import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-compass-svg',
  templateUrl: './compass-svg.component.html',
  styleUrls: ['./compass-svg.component.css']
})
export class CompassSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
