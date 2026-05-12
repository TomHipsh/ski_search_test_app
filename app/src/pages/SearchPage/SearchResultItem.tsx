import type { HotelSearchResult } from './types';
import { formatPrice, getPricePerPerson } from './utils';

type SearchResultItemProps = {
  hotel: HotelSearchResult;
  siteName: string | number;
};

export const SearchResultItem = ({
  hotel,
  siteName,
}: SearchResultItemProps) => {
  return (
    <article className="hotel-result">
      <img
        className="hotel-result-image"
        src={hotel.contentImageLink}
        alt={hotel.hotelName}
      />
      <div className="hotel-result-details">
        <h2>{hotel.hotelName}</h2>
        <p>{hotel.rating}</p>
        <p>{siteName}</p>
        <p>{formatPrice(getPricePerPerson(hotel))}</p>
      </div>
    </article>
  );
};
