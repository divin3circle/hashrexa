import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPersonalInformation } from "@/types";
import logo from "../../public/icon-dark.png";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useAppKitAccount } from "@reown/appkit/react-core";
import toast from "react-hot-toast";

function ProfileSetup() {
  const navigate = useNavigate();
  const { address } = useAppKitAccount();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UserPersonalInformation) => {
      return axios.post(
        `${BACKEND_URL}/personal-information/${data.userAccountId}`,
        data
      );
    },
    onSuccess: () => {
      navigate("/profile");
    },
    onError: (error) => {
      toast.error("Error submitting form");
      console.error("Error submitting form:", error);
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserPersonalInformation>>({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
    topicId: "",
    userAccountId: "",
    profileMessageLength: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/profile");
  };

  const handleInputChange = (
    field: keyof UserPersonalInformation,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Handle image preview for profile picture
    if (field === "profilePicture") {
      if (value && /^https?:\/\/.+/.test(value)) {
        setImagePreview(value);
      } else {
        setImagePreview(null);
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.profilePicture?.trim()) {
      newErrors.profilePicture = "Profile picture URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.profilePicture)) {
      newErrors.profilePicture = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bio?.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters";
    } else if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // Handle form submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      mutate({
        ...formData,
        userAccountId: (address as string) || "",
      } as UserPersonalInformation);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const progressPercentage = (currentStep / 2) * 100;

  return (
    <div className=" flex items-center justify-center h-screen">
      <div className="max-w-6xl w-full flex gap-2">
        {/* Left Column - Form */}
        <div className="flex-1 flex flex-col border border-gray-300 rounded-3xl mx-2 md:mx-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <h1 className="font-bold font-mono p-1.5 md:p-0 uppercase text-xl">
                #<span className="text-[#ff9494] text-3xl lowercase">hash</span>
                .
              </h1>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-900 underline transition-colors"
            >
              Do it Later?
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-[#ff9494] h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Set up your profile
                  </h1>
                  <p className="text-gray-600">
                    Let's start by creating your profile.
                  </p>
                </div>

                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  {imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            profilePicture: "",
                          }));
                        }}
                        onError={() => setImagePreview(null)}
                        title="Click to change image"
                      />
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({
                              ...prev,
                              profilePicture: "",
                            }));
                          }}
                          className="text-sm text-[#ff9494] hover:text-[#ff8080] transition-colors"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      id="profilePicture"
                      type="url"
                      value={formData.profilePicture}
                      onChange={(e) =>
                        handleInputChange("profilePicture", e.target.value)
                      }
                      placeholder="https://example.com/your-photo.jpg"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9494] ${
                        errors.profilePicture
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  )}
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm">
                      {errors.profilePicture}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    placeholder="Enter your username"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9494] ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9494] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Tell us about yourself
                  </h1>
                  <p className="text-gray-600">
                    Share a bit about your background and interests
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what brings you to HashRexa..."
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9494] resize-none ${
                      errors.bio ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {formData.bio?.length || 0}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  onClick={handleNext}
                  disabled={isPending || !address}
                  className="flex items-center gap-2 bg-[#ff9494] hover:bg-[#ff8080] text-white"
                >
                  {!isPending && currentStep === 2 ? "Complete Setup" : "Next"}
                  {!isPending && <ArrowRight className="w-4 h-4" />}
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0">
            <img
              src="https://assets.staticimg.com/reaper-image/65325c9b54e41a00014a2480_The%20Tokenization%20Revolution-1600%20900.png"
              alt="Tokenization Revolution"
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Welcome to the Future of Finance
              </h2>
              <p className="text-lg opacity-90">
                Join the tokenization revolution and unlock new possibilities
                for your investments
              </p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src={logo} alt="HashRexa" className="w-6 h-6" />
                </div>
                <span className="font-semibold">
                  HashRexa - Your Gateway to Tokenized Assets
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
