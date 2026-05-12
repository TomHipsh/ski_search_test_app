import type {
  HotelVendors,
  HotelsSearchRequest,
  HotelsSearchResponse,
} from '../../types.js';

export abstract class AbstractHotelRepository<
  TVendorRequest,
  TVendorResponse,
> {
  protected constructor(
    public readonly vendor: HotelVendors,
    protected readonly getHotelsUrl: string,
  ) {}

  abstract searchHotels: (
    request: HotelsSearchRequest,
  ) => Promise<HotelsSearchResponse>;

  protected abstract toVendorRequest: (
    request: HotelsSearchRequest,
  ) => TVendorRequest;

  protected abstract toHotelsSearchResponse: (
    response: TVendorResponse,
    request: HotelsSearchRequest,
  ) => HotelsSearchResponse;
}
