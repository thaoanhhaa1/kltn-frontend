export interface ILngLatToAddressRes {
    results: Result[];
    status: string;
}

export interface Result {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    reference: string;
    plus_code: PlusCode;
    compound: Compound;
    types: string[];
    name: string;
    address: string;
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
}

export interface Compound {
    district: string;
    commune: string;
    province: string;
}

export interface Geometry {
    location: Location;
    boundary: null;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface IAddressToLngLat {
    plus_code: IAddressToLngLatPlusCode;
    results: Result[];
    status: string;
}

export interface IAddressToLngLatPlusCode {}

export interface Result {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    reference: string;
    plus_code: ResultPlusCode;
    types: string[];
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
}

export interface Geometry {
    location: Location;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface ResultPlusCode {
    compound_code: string;
    global_code: string;
}
