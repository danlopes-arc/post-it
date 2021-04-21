import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-new-post-svg',
  templateUrl: './new-post-svg.component.html',
  styleUrls: ['./new-post-svg.component.css']
})
export class NewPostSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;
  @Input() color: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
