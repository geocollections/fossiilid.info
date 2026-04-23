declare module "wicket/wicket" {
  interface WktStatic {
    new (obj?: any): WktInstance;
    beginsWith: (str: string, sub: string) => boolean;
    endsWith: (str: string, sub: string) => boolean;
    delimiter: string;
    isArray: (obj: any) => boolean;
    trim: (str: string, sub: string) => string;
    Wkt: typeof WktConstructor;
  }

  class WktConstructor {
    constructor(obj?: any);
    delimiter: string;
    wrapVertices: string;
    regExes: string;
    components: string;
    isCollection(): boolean;
    sameCoords(a: any, b: any): boolean;
    fromObject(obj: any): WktConstructor;
    toObject(config?: any): any;
    toString(config?: any): string;
    fromJson(obj: any): WktConstructor;
    toJson(): any;
    merge(wkt: string): WktConstructor;
    read(str: string): WktConstructor;
    write(components?: Array<any>): string;
    extract: Extract;
    isRectangle: boolean;
  }

  type WktInstance = WktConstructor;

  interface Extract {
    point: (point: any) => string;
    multipoint: (multipoint: any) => string;
    linestring: (linestring: any) => string;
    multilinestring: (multilinestring: any) => string;
    polygon: (polygon: any) => string;
    multipolygon: (multipolygon: any) => string;
    box: (box: any) => string;
  }

  const Wkt: WktStatic;
  export default Wkt;
}
