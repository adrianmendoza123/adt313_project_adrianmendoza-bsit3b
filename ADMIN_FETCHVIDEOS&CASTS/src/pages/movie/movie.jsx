import { Outlet } from 'react-router-dom';
import './movie.css';

const Movie = () => {
  return (
    <>
    <h1 style={{
  color: "white",
  fontSize: "1.8rem",
  fontWeight: "bold",
  borderBottom: "3px solid #1d1c1b",
  paddingBottom: "10px",
  marginBottom: "10px",
  letterSpacing: "1px",
  paddingBottom : "15px",
  textTransform: "uppercase",
}}>Movie Page</h1>

      <Outlet />
    </>
  );
};

export default Movie;