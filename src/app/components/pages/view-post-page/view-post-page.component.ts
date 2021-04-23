import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Post} from '../../../models/Post';
import {User} from '../../../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {Comment} from '../../../models/Comment';
import {getRelativeTime} from '../../../utils/relativeTime';
import {getCoordinatesAddress} from '../../../utils/geolocation';


@Component({
  selector: 'app-view-post-page',
  templateUrl: './view-post-page.component.html',
  styleUrls: ['./view-post-page.component.css']
})
export class ViewPostPageComponent implements OnInit {

  post: Post | null = null;
  getRelativeTime = getRelativeTime;
  postUser: User | null = null;
  authUser: User | null = null;
  postComments: Comment[] = [];
  userComments: Comment[] = [];
  commentators: User[] = [];
  address: string | null = null;
  @ViewChild('map') map: ElementRef | null = null;

  constructor(public router: Router,
              private database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    const {id} = this.activatedRoute.snapshot.params;
    if (!id) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.post = await this.database.posts.findById(id);

    if (!this.post) {
      await this.router.navigate(['timeline']);
      return;
    }
    if (this.post.hasCoordinates()) {
      this.address = await getCoordinatesAddress(this.post.latitude || 0, this.post.longitude || 0);
      this.loadMap();
    }
    this.authUser = await this.auth.getUser();
    this.postUser = await this.database.users.getPostUser(this.post);
    this.postComments = await this.database.comments.getPostComments(this.post);
    this.userComments = new Array(...this.postComments);
    this.userComments.filter(c => c.userId === this.authUser?.id);
    for (const comment of this.postComments) {
      const user = await this.database.users.getCommentUser(comment);
      if (user) {
        this.commentators.push(user);
      }
    }
  }

  async loadMap(): Promise<void> {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      return;
    }
    const coords = {
      lat: this.post?.latitude || 0,
      lng: this.post?.longitude || 0
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
        zoom: 10,
        center: coords,
        pixelRatio: window.devicePixelRatio || 1
      });
    window.addEventListener('resize', () => map.getViewPort().resize());
    const ui = H.ui.UI.createDefault(map, defaultLayers);
    ui.getControl('mapsettings').setVisibility(false);
    const bubble = new H.ui.InfoBubble(coords, {
      content: this.address || ''
    });
    // tslint:disable-next-line:no-unused-expression
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    // ui.addBubble(bubble);
    const icon = new H.map.Icon('assets/marker.svg');
    const marker = new H.map.Marker(coords, {icon});
    map.addObject(marker);
  }

}
