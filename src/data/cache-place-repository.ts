import {
  PlaceRepository,
  PlaceSearchData,
  Place,
  PlacesAdminData,
  CountryPlacesData,
  PlaceAdminData
} from "@ournet/places-domain";
import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import { CacheStorage } from "./cache-storage";
import { SECONDS_1D, SECONDS_3D, SECONDS_7D } from "../utils";
import { uniq } from "../domain/base/util";

export class CachePlaceRepository implements PlaceRepository {
  constructor(private rep: PlaceRepository, private storage: CacheStorage) {}
  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: Place): Promise<Place> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<Place>): Promise<Place> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<Place> | undefined
  ): Promise<Place | null> {
    const key = this.storage.formatKey(["Place", "getById_1", id]);

    return this.storage.executeCached(key, SECONDS_3D, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<Place> | undefined
  ): Promise<Place[]> {
    const key = this.storage.formatKey(["Place", "getByIds_1", ...uniq(ids)]);

    return this.storage.executeCached(key, SECONDS_3D, () =>
      this.rep.getByIds(ids, options)
    );
  }

  exists(id: string): Promise<boolean> {
    return this.rep.exists(id);
  }
  deleteStorage(): Promise<void> {
    return this.rep.deleteStorage();
  }
  createStorage(): Promise<void> {
    return this.rep.createStorage();
  }

  search(data: PlaceSearchData, options?: RepositoryAccessOptions<Place>) {
    return this.rep.search(data, options);
  }

  getAdmin1s(
    data: CountryPlacesData,
    options?: RepositoryAccessOptions<Place>
  ) {
    const key = this.storage.formatKey([
      "Place",
      "getAdmin1s_1",
      data.country,
      data.limit
    ]);

    return this.storage.executeCached(key, SECONDS_3D, () =>
      this.rep.getAdmin1s(data, options)
    );
  }

  getAdmin1(data: PlaceAdminData, options?: RepositoryAccessOptions<Place>) {
    const key = this.storage.formatKey([
      "Place",
      "getAdmin1_1",
      data.country,
      data.admin1Code
    ]);

    return this.storage.executeCached(key, SECONDS_7D, () =>
      this.rep.getAdmin1(data, options)
    );
  }

  getPlacesInAdmin1(
    data: PlacesAdminData,
    options?: RepositoryAccessOptions<Place>
  ) {
    const key = this.storage.formatKey([
      "Place",
      "getPlacesInAdmin1_1",
      data.country,
      data.admin1Code,
      data.limit
    ]);

    return this.storage.executeCached(key, SECONDS_3D, () =>
      this.rep.getPlacesInAdmin1(data, options)
    );
  }

  getOldPlaceId(id: number) {
    const key = this.storage.formatKey(["Place", "getOldPlaceId", id]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.getOldPlaceId(id)
    );
  }

  getMainPlaces(
    data: CountryPlacesData,
    options?: RepositoryAccessOptions<Place>
  ) {
    const key = this.storage.formatKey([
      "Place",
      "getMainPlaces_1",
      data.country,
      data.limit
    ]);

    return this.storage.executeCached(key, SECONDS_3D, () =>
      this.rep.getMainPlaces(data, options)
    );
  }
}
