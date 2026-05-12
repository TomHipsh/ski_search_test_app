import type {
  Hotel,
  HotelsSearchRequest,
  HotelsSearchResponse,
} from '../../types.js';

export type WeSkiHotelsRequest = {
  query: {
    ski_site: number;
    from_date: string;
    to_date: string;
    group_size: number;
  };
};

type WeSkiImage = {
  MainImage?: string;
  URL?: string;
};

type WeSkiAccommodation = {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent?: {
    Images?: WeSkiImage[];
  };
  HotelInfo?: {
    Rating?: string;
  };
  PricesInfo?: {
    AmountBeforeTax?: string;
  };
};

export type WeSkiHotelsResponse = {
  statusCode: number;
  body: {
    success: string;
    accommodations: WeSkiAccommodation[];
  };
};

export const toWeSkiHotelsRequest = (
  request: HotelsSearchRequest,
): WeSkiHotelsRequest => {
  return {
    query: {
      ski_site: request.skiSite,
      from_date: toWeSkiDate(request.startDate),
      to_date: toWeSkiDate(request.endDate),
      group_size: request.groupSize,
    },
  };
};

export const toHotelsSearchResponse = (
  response: WeSkiHotelsResponse,
  request: HotelsSearchRequest,
): HotelsSearchResponse => {
  return response.body.accommodations.map((accommodation) => {
    return toHotel(accommodation, request);
  });
};

const toHotel = (
  accommodation: WeSkiAccommodation,
  request: HotelsSearchRequest,
): Hotel => {
  return {
    hotelCode: accommodation.HotelCode,
    hotelName: accommodation.HotelName,
    rating: Number(accommodation.HotelInfo?.Rating ?? 0),
    contentImageLink: getMainImageLink(accommodation),
    skiSite: request.skiSite,
    groupSize: request.groupSize,
    totalPrice: Number(accommodation.PricesInfo?.AmountBeforeTax ?? 0),
  };
};

const getMainImageLink = (accommodation: WeSkiAccommodation): string => {
  const images = accommodation.HotelDescriptiveContent?.Images ?? [];
  const mainImage = images.find((image) => image.MainImage === 'True');

  return mainImage?.URL ?? images[0]?.URL ?? '';
};

const toWeSkiDate = (date: string): string => {
  const [day, month, year] = date.split('/');

  return `${month}/${day}/${year}`;
};
