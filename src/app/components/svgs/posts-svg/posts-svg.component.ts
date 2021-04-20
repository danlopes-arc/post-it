import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-posts-svg',
  templateUrl: './posts-svg.component.html',
  styleUrls: ['./posts-svg.component.css']
})
export class PostsSvgComponent implements OnInit {
  @Input() height: number | null = null;
  @Input() width: number | null = null;
  @Input() color: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
