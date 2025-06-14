import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { userProfileData, userProfileSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/lib/users/updateUser";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./ui/avatar";

export default function ProfileSection() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>("");
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<userProfileData>({
    resolver: zodResolver(userProfileSchema),
  });

  const avatarFile = watch("avatar");

  // Update preview when avatarFile changes
  useEffect(() => {
    // Check if avatarFile exists and is a File object
    if (avatarFile && avatarFile instanceof File) {
      // Directly create the object URL from the File object
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreview(objectUrl);
      console.log("Preview updated:", objectUrl);

      // Cleanup the object URL on unmount or when avatarFile changes
      return () => {
        URL.revokeObjectURL(objectUrl);
        console.log("Object URL revoked:", objectUrl);
      };
    } else {
      // If no file is selected or avatarFile is not a File, clear the preview
      setPreview(null);
      console.log("Preview cleared.");
    }
  }, [avatarFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) return;
      setValue("avatar", event.target.files[0]);
    }
  };

  const submitProfile = async (userProfileData: userProfileData) => {
    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(userProfileData);
      // Append a cache-busting query parameter to prevent the use of previous cached image
      updatedUser.avatarUrl = `${updatedUser.avatarUrl}?t=${updatedUser.updatedAt}`;

      console.log("User profile updated:", updatedUser);
      setUser(updatedUser);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  return (
    <div className="mx-auto py-4 px-[5vw]">
      {/* Top section */}
      <div className="flex justify-between items-center">
        {/* Profile image */}
        <Avatar src={user.avatarUrl} alt="Profile picture" size={100} />

        {/* Edit profile dialog*/}
        <div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setDialogOpen(true)}
                className="bg-foreground/10 text-white font-semibold text-sm px-5 py-2 rounded-md hover:bg-foreground/20 transition cursor-pointer"
              >
                Edit profile
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[470px]">
              <form
                onSubmit={handleSubmit(submitProfile)}
                className="flex flex-col justify-center items-center"
              >
                <DialogHeader>
                  <DialogTitle className="text-center mb-4">
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>
                {/* Profile picture*/}
                <label htmlFor="image-upload" className="mb-5 cursor-pointer">
                  {preview ? (
                    <Avatar src={preview} alt="Uploaded image" size={150} />
                  ) : (
                    <Avatar
                      src={user.avatarUrl}
                      alt="Profile picture"
                      size={150}
                    />
                  )}
                  <Input
                    id="image-upload"
                    onChange={handleFileChange}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0"
                  />
                </label>
                {errors.avatar && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.avatar.message}
                  </p>
                )}
                <Input
                  id="displayName"
                  {...register("displayName")}
                  placeholder="Display Name"
                  defaultValue={user.displayName}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.displayName.message}
                  </p>
                )}
                <Textarea
                  placeholder="Bio"
                  className="resize-none h-35 my-4"
                  {...register("bio")}
                  defaultValue={user.bio}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.bio.message}
                  </p>
                )}
                <DialogFooter className="w-full">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Name and handle */}
      <div className="mt-4">
        <h1 className="text-xl font-bold text-white">{user.displayName}</h1>
        <p className="text-foreground/60 mt-2">{user.bio}</p>
      </div>

      {/* Joined info */}
      <div className="mt-2 text-foreground/50 text-sm">
        <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Follower and Following */}
      <div className="mt-2 flex gap-4 pb-5 text-sm text-white border-b border-foreground/15">
        <span>
          <strong>{user.followingCount}</strong> Following
        </span>
        <span>
          <strong>{user.followersCount}</strong> Followers
        </span>
      </div>
    </div>
  );
}
