import "leaflet";

declare module "leaflet" {
  namespace control {
    function coordinates(options?: {
      position?: string;
      useLatLngOrder?: boolean;
      enableUserInput?: boolean;
    }): Control;
  }
}
