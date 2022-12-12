import {
  Place,
  PlaceSearchData,
  PlaceAdminData,
  PlacesAdminData,
  CountryPlacesData
} from "@ournet/places-domain";
import { Context } from "../../context";

export default {
  Query: {
    places_placeById: (_: any, args: { id: string }, context: Context) => {
      return context.data.placeRep.getById(args.id);
    },
    places_searchPlace: (_: any, args: PlaceSearchData, context: Context) => {
      if (!args.query || args.query.length < 2) {
        return Promise.reject(new Error(`'query' must be greater than 2`));
      }

      return context.data.placeRep.search(args);
    },
    places_placesByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids?.length) return [];
      return context.data.placeRep.getByIds(args.ids);
    },
    places_placesByAdmin1Code: (
      _: any,
      args: PlacesAdminData,
      context: Context
    ) => {
      return context.data.placeRep.getPlacesInAdmin1(args);
    },
    places_mainPlaces: (_: any, args: CountryPlacesData, context: Context) => {
      return context.data.placeRep.getMainPlaces(args);
    },
    places_admin1s: (_: any, args: CountryPlacesData, context: Context) => {
      return context.data.placeRep.getAdmin1s(args);
    },
    places_admin1: (_: any, args: PlaceAdminData, context: Context) => {
      return context.data.placeRep.getAdmin1(args);
    },
    places_placeOldId: async (
      _: any,
      args: { id: number },
      context: Context
    ) => {
      return context.data.placeRep.getOldPlaceId(args.id);
    }
  },

  Place: {
    admin1: (place: Place, _: any, context: Context) => {
      if (place.admin1 === null) {
        return undefined;
      }
      if (place.admin1) {
        return place.admin1;
      }
      if (place.featureClass === "A" && place.featureCode === "ADM1") {
        return place;
      }
      if (place.admin1Code && place.countryCode && place.featureClass !== "A") {
        return context.data.placeRep.getAdmin1({
          country: place.countryCode,
          admin1Code: place.admin1Code
        });
      }
    }
  }
};
