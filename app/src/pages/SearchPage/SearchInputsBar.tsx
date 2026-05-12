import type { FormEvent } from 'react';
import type { SearchFormState, SkiSite } from './types';

type SearchInputsBarProps = {
  formState: SearchFormState;
  sites: SkiSite[];
  isLoadingSites: boolean;
  canSearch: boolean;
  onChange: (formState: SearchFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const SearchInputsBar = ({
  formState,
  sites,
  isLoadingSites,
  canSearch,
  onChange,
  onSubmit,
}: SearchInputsBarProps) => {
  const updateField = (field: keyof SearchFormState, value: string) => {
    onChange({
      ...formState,
      [field]: value,
    });
  };

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <label className="search-field">
        <span>Site name</span>
        <select
          value={formState.siteName}
          onChange={(event) => updateField('siteName', event.target.value)}
          disabled={isLoadingSites}
        >
          <option value="">Select site</option>
          {sites.map((site) => (
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
          value={formState.groupSize}
          onChange={(event) => updateField('groupSize', event.target.value)}
        />
      </label>

      <div className="date-range" role="group">
        <label className="search-field">
          <span>Start date</span>
          <input
            type="date"
            value={formState.startDate}
            onChange={(event) => updateField('startDate', event.target.value)}
          />
        </label>
        <label className="search-field">
          <span>End date</span>
          <input
            min={formState.startDate}
            type="date"
            value={formState.endDate}
            onChange={(event) => updateField('endDate', event.target.value)}
          />
        </label>
      </div>

      <button className="search-button" type="submit" disabled={!canSearch}>
        Search
      </button>
    </form>
  );
};
