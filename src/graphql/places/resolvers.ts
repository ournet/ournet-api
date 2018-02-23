
import { Data } from '../../data';
import { IPlace } from '@ournet/places-domain';

export default {
    Query: {
        places_placeById: (_: any, args: { id: number }) => {
            return Data.places.access.getById(args.id);
        },
        places_searchPlace: (_: any, args: { query: string, country: string, limit: number, searchType?: string }) => {
            if (!args.query || args.query.length < 2) {
                return Promise.reject(new Error(`'query' must be greater than 2`));
            }
            return Data.places.access.search({
                query: args.query,
                country: args.country,
                limit: args.limit,
                type: args.searchType,
            })
                .then(items => items.map(place => place.id))
                .then(ids => {
                    if (ids && ids.length) {
                        return Data.places.access.getByIds(ids);
                    }
                    return [];
                });
        },
        places_placesByIds: (_: any, args: { ids: number[] }) => {
            return Data.places.access.getByIds(args.ids);
        },
        places_placesByAdmin1Code: (_: any, args: { country: string, admin1Code: string, limit: number }) => {
            return Data.places.access.getPlacesInAdmin1(args);
        },
        places_mainPlaces: (_: any, args: { country: string, limit: number }) => {
            return Data.places.access.getMainPlaces(args);
        },
        places_admin1s: (_: any, args: { country: string, limit: number }) => {
            return Data.places.access.getAdmin1s(args);
        },
        places_admin1: (_: any, args: { admin1Code: string, country: string }) => {
            return Data.places.access.getAdmin1(args);
        },
        places_placeOldId: (_: any, args: { id: number }) => {
            return Data.places.access.getOldPlaceId(args.id);
        }
    },

    Place: {
        admin1: (place: IPlace) => {
            if (place.admin1 === null) {
                return undefined;
            }
            if (place.admin1) {
                return place.admin1;
            }
            if (place.featureClass === 'A' && place.featureCode === 'ADM1') {
                return place;
            }
            if (place.admin1Code && place.countryCode && place.featureClass !== 'A') {
                return Data.places.access.getAdmin1({ country: place.countryCode, admin1Code: place.admin1Code });
            }
        }
    }
}
