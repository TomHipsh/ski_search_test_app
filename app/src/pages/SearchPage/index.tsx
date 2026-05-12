import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchSites, searchHotels } from './api';
import { SearchInputsBar } from './SearchInputsBar';
import { SearchResultItem } from './SearchResultItem';
import type { SearchFormState } from './types';
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
    formState.siteName.trim().length > 0 &&
    isValidGroupSize(formState.groupSize) &&
    isValidDateRange(formState.startDate, formState.endDate) &&
    !searchMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    searchMutation.mutate({
      skiSiteName: formState.siteName,
      startDate: toApiDate(formState.startDate),
      endDate: toApiDate(formState.endDate),
      groupSize: Number(formState.groupSize),
    });
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

        {searchMutation.isError && (
          <p className="status-message">Could not search hotels.</p>
        )}

        <section className="results-list">
          {searchMutation.isPending && (
            <p className="status-message">Searching hotels...</p>
          )}

          {(searchMutation.data ?? []).map((hotel) => (
            <SearchResultItem
              key={hotel.hotelCode}
              hotel={hotel}
              siteName={sitesById.get(hotel.skiSite) ?? hotel.skiSite}
            />
          ))}
        </section>
      </section>
    </main>
  );
};
