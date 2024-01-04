import React, { useState } from "react";
import Loader from "./components/Loader";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isloading,setLoading] = useState(false)

  const fetchMoviesHandler = async () => {
    setLoading(true)
    const response = await fetch("https://swapi.dev/api/films");
    const data = await response.json();
    const films = data.results.map((film) => {
      return {
        id: film.episode_id,
        title: film.tilte,
        releaseDate: film.opening_crawl,
        openingText: film.release_date,
      };
    });
    setMovies(films);
    setLoading(false)
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isloading && <Loader/> }
        {!isloading &&<MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
