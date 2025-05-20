// View/update user profile info

import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading profile...</p>; // Fallback if user is null

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* <p>Role: {user.role}</p> */}{/* Removed user.role as it does not exist on User type */}
    </div>
  );
};

export default ProfilePage;