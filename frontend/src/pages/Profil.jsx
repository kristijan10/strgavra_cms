import { useAuth } from "../context/authContext.js";

const Profile = () => {
  const { user } = useAuth();

  return <div>Zdravo {user?.username}</div>;
};

export default Profile;
