import type { SearchFormState } from './types';

type SearchResultsHeaderProps = {
  resultsCount: number;
  submittedFormState: SearchFormState;
};

export const SearchResultsHeader = ({
  resultsCount,
  submittedFormState,
}: SearchResultsHeaderProps) => {
  return (
    <header className="results-header">
      <h1>Select your ski trip</h1>
      <p>
        {resultsCount} ski trips options • {submittedFormState.siteName} •{' '}
        {formatDisplayDate(submittedFormState.startDate)} -{' '}
        {formatDisplayDate(submittedFormState.endDate)} •{' '}
        {submittedFormState.groupSize} people
      </p>
    </header>
  );
};

const formatDisplayDate = (date: string): string => {
  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
};
