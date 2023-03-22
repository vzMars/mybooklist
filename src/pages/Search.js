import { useState } from 'react';
import Books from '../components/Books';
import Pagination from '../components/Pagination';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    setCurrentPage(1);
    setLoading(true);
    setError(null);

    const response = await fetch(
      `http://localhost:5000/api/books/search/${query}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(json.error);
    }

    if (response.ok && json.length > 0) {
      setSearchResults(json);
      setLoading(false);
    } else {
      setLoading(false);
      setError('There were no results for your search term.');
    }
  };

  const indexOfLastBook = currentPage * resultsPerPage;
  const indexOfFirstBook = indexOfLastBook - resultsPerPage;
  const currentBooks = searchResults.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className='max-w-6xl mx-auto mt-10 w-full'>
      <section className='px-3 md:px-10 flex flex-col'>
        <h1 className='text-5xl font-bold mb-5 text-red-600'>Search</h1>
        <form
          className='flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-2 mb-5'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className='p-3 rounded-lg md:flex-1'
          />
          <button
            disabled={!query.length}
            className='bg-red-600 hover:bg-red-700 rounded-md p-3 px-10 text-black font-bold'
          >
            Search
          </button>
        </form>
        <Books books={currentBooks} loading={loading} />
        <Pagination
          resultsPerPage={resultsPerPage}
          totalResults={searchResults.length}
          currentPage={currentPage}
          paginate={paginate}
        />
        {error && (
          <div className='p-2 bg-rose-100 rounded border-2 text-rose-600 border-rose-600 font-medium'>
            {error}
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
