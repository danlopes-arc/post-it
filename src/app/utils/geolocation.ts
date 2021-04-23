import GeocodingService = H.service.GeocodingService;

export interface GeolocationResponse {
  location?: GeolocationPosition;
  error?: GeolocationPositionError;
}

export const getCurrentLocation = (): Promise<GeolocationResponse> =>
  new Promise((resolve) => {
    window.navigator.geolocation.getCurrentPosition(location => {
      resolve({location});
    }, error => {
      resolve({error});
    });
  });

export const getCoordinatesAddress = (latitude: number, longitude: number): Promise<string | null> =>
  new Promise((resolve => {
    const platform = new H.service.Platform({
      apikey: 'phG3bW_BRgRzfbyc_k8LlWDhKyDqE_VYEPfMX4fApPA'
    });
    // @ts-ignore
    const service = platform.getSearchService() as GeocodingService;
    service.reverseGeocode({
      at: `${latitude},${longitude}`
    }, result => {
      if (result.items[0]) {
        resolve(result.items[0].address.label);
        return;
      }
      resolve('');
    }, () => resolve(''));
  }));
