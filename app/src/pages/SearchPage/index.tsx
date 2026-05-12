import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSites } from './api';
import { SearchInputsBar } from './SearchInputsBar';
import { SearchResultItem } from './SearchResultItem';
import type { SearchFormState, SearchHotelsRequest } from './types';
import { useHotelSearchQueries } from './useHotelSearchQueries';
import { isValidDateRange, isValidGroupSize, toApiDate } from './utils';
import './SearchPage.css';

const initialFormState: SearchFormState = {
  siteName: '',
  groupSize: '',
  startDate: '',
  endDate: '',
};

export const SearchPage = () => {
  const [formState, setFormState] = useState<SearchFormState>(initialFormState);
  const [searchRequests, setSearchRequests] = useState<SearchHotelsRequest[]>(
    [],
  );

  const sitesQuery = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });

  const hotelSearch = useHotelSearchQueries(searchRequests);

  const sitesById = useMemo(() => {
    return new Map((sitesQuery.data ?? []).map((site) => [site.id, site.name]));
  }, [sitesQuery.data]);

  const canSearch =
    formState.siteName.trim().length > 0 &&
    isValidGroupSize(formState.groupSize) &&
    isValidDateRange(formState.startDate, formState.endDate);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    setSearchRequests(createSearchRequests(formState));
  };

  return (
    <main className="search-page">
      <section className="search-page-content">
        <SearchInputsBar
          formState={formState}
          sites={sitesQuery.data ?? []}
          isLoadingSites={sitesQuery.isLoading}
          canSearch={canSearch}
          onChange={setFormState}
          onSubmit={handleSubmit}
        />

        {sitesQuery.isError && (
          <p className="status-message">Could not load ski sites.</p>
        )}

        {hotelSearch.isError && (
          <p className="status-message">Could not search hotels.</p>
        )}

        <section className="results-list">
          {hotelSearch.isFetching && (
            <p className="status-message">Searching hotels...</p>
          )}

          {hotelSearch.results.map((hotel) => (
            <SearchResultItem
              key={`${hotel.hotelCode}-${hotel.groupSize}`}
              hotel={hotel}
              siteName={sitesById.get(hotel.skiSite) ?? hotel.skiSite}
            />
          ))}
        </section>
      </section>
    </main>
  );
};

const createSearchRequests = (
  formState: SearchFormState,
): SearchHotelsRequest[] => {
  const groupSize = Number(formState.groupSize);
  const baseRequest = {
    skiSiteName: formState.siteName,
    startDate: toApiDate(formState.startDate),
    endDate: toApiDate(formState.endDate),
    groupSize,
  };

  if (groupSize >= 10) {
    return [baseRequest];
  }

  return [
    baseRequest,
    {
      ...baseRequest,
      groupSize: groupSize + 1,
    },
  ];
};
