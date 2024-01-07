import React, { useState, useCallback, useEffect } from "react";
import Loader from "./components/Loader";
import MoviesList from "./components/MoviesList";
import "./App.css";
import Form from "./components/InputForm";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryTimer, setRetryTimer] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    const retryAPI = async () => {
      try {
        const response = await fetch("https://swapi.dev/api/films");
        if (!response.ok) {
          throw new Error("Something went wrong... Retrying");
        }
        const data = await response.json();
        const films = data.results.map((film) => ({
          id: film.episode_id,
          title: film.title,
          releaseDate: film.opening_crawl,
          openingText: film.release_date,
        }));
        setMovies(films);
        setLoading(false);
      } catch (err) {
          const timer = setTimeout(retryAPI, 5000);
          setRetryTimer(timer);
          setError(err.message);
          setLoading(false)
      }
    };

    retryAPI();
  }, []);

  const cancelRetry = () => {
    if (retryTimer) {
      clearTimeout(retryTimer);
      setLoading(false);
      setError("Retry canceled by user.");
    }
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <Form/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={cancelRetry}>Cancel Retry</button>
      </section>
      <section>
        {isLoading && <Loader />}
        {!isLoading && <MoviesList movies={movies} />}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
