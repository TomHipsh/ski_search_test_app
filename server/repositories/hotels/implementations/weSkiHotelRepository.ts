import { AbstractHotelRepository } from './hotelRepository.js';
import {
  toHotelsSearchResponse,
  toWeSkiHotelsRequest,
} from './weSkiParsers.js';
import type {
  WeSkiHotelsRequest,
  WeSkiHotelsResponse,
} from './weSkiParsers.js';
import type { HotelsSearchRequest, HotelsSearchResponse } from '../../types.js';
import { HotelVendors } from '../../types.js';

export class WeSkiHotelRepository extends AbstractHotelRepository<
  WeSkiHotelsRequest,
  WeSkiHotelsResponse
> {
  constructor(getHotelsUrl: string) {
    super(HotelVendors.WeSki, getHotelsUrl);
  }

  searchHotels = async (
    request: HotelsSearchRequest,
  ): Promise<HotelsSearchResponse> => {
    if (!this.getHotelsUrl) {
      throw new Error(`${this.vendor} get hotels URL is not configured`);
    }

    const response = await fetch(this.getHotelsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.toVendorRequest(request)),
    });

    if (!response.ok) {
      throw new Error(
        `${this.vendor} hotels request failed with status ${response.status}`,
      );
    }

    const vendorResponse = (await response.json()) as WeSkiHotelsResponse;

    return this.toHotelsSearchResponse(vendorResponse, request);
  };

  protected toVendorRequest = (
    request: HotelsSearchRequest,
  ): WeSkiHotelsRequest => {
    return toWeSkiHotelsRequest(request);
  };

  protected toHotelsSearchResponse = (
    response: WeSkiHotelsResponse,
    request: HotelsSearchRequest,
  ): HotelsSearchResponse => {
    return toHotelsSearchResponse(response, request);
  };
}
