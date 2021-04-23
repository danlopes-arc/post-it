import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cog-svg',
  templateUrl: './cog-svg.component.html',
  styleUrls: ['./cog-svg.component.css']
})
export class CogSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;
  @Input() color: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
