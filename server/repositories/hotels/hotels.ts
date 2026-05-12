import { WeSkiHotelRepository } from './implementations/weSkiHotelRepository.js';
import { HotelVendors } from '../types.js';

const getHotelsUrls: Partial<Record<HotelVendors, string>> = {
  [HotelVendors.WeSki]: "https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator",
};

export const hotelRepository = new WeSkiHotelRepository(
  getHotelsUrls[HotelVendors.WeSki] ?? '',
);
