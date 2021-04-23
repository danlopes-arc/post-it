import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapModalComponent implements OnInit, AfterViewInit {

  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() address = 'Address';
  @ViewChild('map') map: ElementRef | null = null;
  @Input() onOk = () => {
  }
  @Input() onCancel = () => {
    console.log('close');
  }

  constructor() {
  }

  async ngOnInit(): Promise<void> {
  }

  ngAfterViewInit(): void {
    const mapContainer = this.map?.nativeElement;
    console.log(mapContainer);
    if (!mapContainer) {
      return;
    }
    const coords = {
      lat: this.latitude,
      lng: this.longitude
    };
    const platform = new H.service.Platform({
      apikey: 'phG3bW_BRgRzfbyc_k8LlWDhKyDqE_VYEPfMX4fApPA'
    });
    const defaultLayers = platform.createDefaultLayers();
    // Instantiate (and display) a map object:
    const map = new H.Map(
      mapContainer,
      defaultLayers.vector.normal.map,
      {
        zoom: 14,
        center: coords,
        pixelRatio: window.devicePixelRatio || 1
      });
    window.addEventListener('resize', () => map.getViewPort().resize());
    const icon = new H.map.Icon('assets/marker.svg');
    const marker = new H.map.Marker(coords, {icon});
    map.addObject(marker);

    // // Advanced stuff
    // // Map Controls
    // const ui = H.ui.UI.createDefault(map, defaultLayers);
    // ui.getControl('mapsettings').setVisibility(false);
    // const bubble = new H.ui.InfoBubble(coords, {
    //   content: this.address || ''
    // });
    // // Dragging and scroll/pinch functionality
    // tslint:disable-next-line:no-unused-expression
    // new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  }

}
