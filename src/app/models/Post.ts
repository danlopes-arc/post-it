export class Post {
  id = 0;
  userId = 0;
  title = '';
  body = '';
  latitude: number | null = null;
  longitude: number | null = null;
  createdAt = new Date();
  updatedAt = new Date();

  hasCoordinates(): boolean {
    return this.longitude != null && this.latitude != null;
  }
}
