import { useAuth } from "../../hooks/useAuth";

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <h1>
          HOME PAGE <br />
          HELLO {user?.fullname || 'User'}!!!!
        </h1>
      )}
    </div>
  );
};

export default Home;
