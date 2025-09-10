import { SearchBar } from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { fetchMovies } from "../../services/movieService";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import toast from "react-hot-toast";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(null);
  };
  const onSelect = (movie: Movie) => {
    setMovie(movie);
    openModal();
  };

  const handleMovie = async (query: string) => {
    try {
      setMovies([]);
      setError(false);
      setLoading(true);
      const data = await fetchMovies(query);
      if (data.length > 0) {
        setMovies(data);
      } else {
        toast.error("No movies found for your request.");
      }
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleMovie} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={onSelect} />}
      {isModalOpen && movie && (
        <MovieModal onClose={closeModal} movie={movie} />
      )}
    </div>
  );
}
