import UserProfile from "@/components/UserProfile";

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-wellness-primary mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information, view your schedule, and track your wellness journey.
          </p>
        </div>
        
        <UserProfile />
      </div>
    </div>
  );
};

export default ProfilePage;
