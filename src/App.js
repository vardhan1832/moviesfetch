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
        const response = await fetch("https://movies-dummy-default-rtdb.firebaseio.com/movies.json");
        if (!response.ok) {
          throw new Error("Something went wrong... Retrying");
        }
        const data = await response.json();
        const loadedMovies = []
        for(let key in data){
          loadedMovies.push({
            id:key,
            title:data[key].title,
            releaseDate:data[key].date,
            openingText:data[key].openingText
          })
        }
        setMovies(loadedMovies);
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
  const addmoviehandler = async (obj) =>{
    await fetch('https://movies-dummy-default-rtdb.firebaseio.com/movies.json', {
      method:'POST',
      body:JSON.stringify(obj),
      headers:{
        'Content-Type':'application/json'
      }
    })
    fetchMoviesHandler()
  }
  const deleteHandler = async (id)=>{
    await fetch(`https://movies-dummy-default-rtdb.firebaseio.com/movies/${id}.json`,{
      method:'DELETE',
      headers:{
        'Content-Type':"application/json"
      }
    })
    fetchMoviesHandler()
  }
  return (
    <React.Fragment>
      <section>
        <Form addmovie={addmoviehandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={cancelRetry}>Cancel Retry</button>
      </section>
      <section>
        {isLoading && <Loader />}
        {!isLoading && <MoviesList movies={movies} delete={deleteHandler}/>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
