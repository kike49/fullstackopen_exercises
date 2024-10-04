import { useQuery } from "@apollo/client";
import { ME } from "../queries"; // Ensure you have this query defined

const User = () => {
  const { loading, error, data } = useQuery(ME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const currentUser = data.me;

  return (
    <div>
      <h2>User information</h2>
      <p>Hello {currentUser.username}! Your id is {currentUser.id}</p>
      <h3>Your Favorite Genres:</h3>
      <ul>
        {currentUser.favoriteGenre.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
