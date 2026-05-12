import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import './SearchPage.css';

type SkiSite = {
  id: number;
  name: string;
  namespace: string;
};

type HotelSearchResult = {
  hotelCode: string;
  hotelName: string;
  rating: number;
  contentImageLink: string;
  skiSite: number;
  groupSize: number;
  totalPrice: number;
};

type SearchHotelsRequest = {
  skiSiteName: string;
  startDate: string;
  endDate: string;
  groupSize: number;
};

const fetchSites = async (): Promise<SkiSite[]> => {
  const response = await fetch('/sites');

  if (!response.ok) {
    throw new Error('Failed to load ski sites');
  }

  return response.json();
};

const searchHotels = async (
  request: SearchHotelsRequest,
): Promise<HotelSearchResult[]> => {
  const response = await fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to search hotels');
  }

  return response.json();
};

export const SearchPage = () => {
  const [siteName, setSiteName] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const sitesQuery = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });

  const searchMutation = useMutation({
    mutationFn: searchHotels,
  });

  const sitesById = useMemo(() => {
    return new Map((sitesQuery.data ?? []).map((site) => [site.id, site.name]));
  }, [sitesQuery.data]);

  const canSearch =
    siteName.trim().length > 0 &&
    isValidGroupSize(groupSize) &&
    startDate.length > 0 &&
    endDate.length > 0 &&
    new Date(startDate).getTime() <= new Date(endDate).getTime() &&
    !searchMutation.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    searchMutation.mutate({
      skiSiteName: siteName,
      startDate: toApiDate(startDate),
      endDate: toApiDate(endDate),
      groupSize: Number(groupSize),
    });
  };

  return (
    <main className="search-page">
      <section className="search-page-content">
        <form className="search-bar" onSubmit={handleSubmit}>
          <label className="search-field">
            <span>Site name</span>
            <select
              value={siteName}
              onChange={(event) => setSiteName(event.target.value)}
              disabled={sitesQuery.isLoading}
            >
              <option value="">Select site</option>
              {(sitesQuery.data ?? []).map((site) => (
                <option key={site.id} value={site.name}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label className="search-field search-field-compact">
            <span>Group size</span>
            <input
              max="10"
              min="1"
              type="number"
              value={groupSize}
              onChange={(event) => setGroupSize(event.target.value)}
            />
          </label>

          <div className="date-range" role="group">
            <label className="search-field">
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>
            <label className="search-field">
              <span>End date</span>
              <input
                min={startDate}
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
          </div>

          <button className="search-button" type="submit" disabled={!canSearch}>
            Search
          </button>
        </form>

        {sitesQuery.isError && (
          <p className="status-message">Could not load ski sites.</p>
        )}

        {searchMutation.isError && (
          <p className="status-message">Could not search hotels.</p>
        )}

        <section className="results-list">
          {searchMutation.isPending && (
            <p className="status-message">Searching hotels...</p>
          )}

          {(searchMutation.data ?? []).map((hotel) => (
            <article className="hotel-result" key={hotel.hotelCode}>
              <img
                className="hotel-result-image"
                src={hotel.contentImageLink}
                alt={hotel.hotelName}
              />
              <div className="hotel-result-details">
                <h2>{hotel.hotelName}</h2>
                <p>{hotel.rating}</p>
                <p>{sitesById.get(hotel.skiSite) ?? hotel.skiSite}</p>
                <p>{formatPrice(getPricePerPerson(hotel))}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
};

const toApiDate = (date: string): string => {
  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
};

const isValidGroupSize = (value: string): boolean => {
  const groupSize = Number(value);

  return Number.isInteger(groupSize) && groupSize >= 1 && groupSize <= 10;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

const getPricePerPerson = (hotel: HotelSearchResult): number => {
  return hotel.totalPrice / hotel.groupSize;
};
