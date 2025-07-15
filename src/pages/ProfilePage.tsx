import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/user/useUserProfile";
import ProfileForm from "../components/profile/ProfileForm";

const ProfilePage = () => {
  const { currentUser: user } = useAuth();
  const { profile, loading, error } = useUserProfile(user);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {profile && <ProfileForm />}
    </div>
  );
};
export default ProfilePage;
