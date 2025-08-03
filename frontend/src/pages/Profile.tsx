import Navbar from "@/components/app/landing/Navbar";
import { Edit, TrendingUp } from "lucide-react";
import { usePortfolioBalance } from "@/hooks/usePortfolio";
import { useTokens } from "@/hooks/useTokens";
import { useLoans } from "@/hooks/useLoans";

function Profile() {
  const { data: portfolioData } = usePortfolioBalance();
  const { tokenizedAssets } = useTokens();
  const { data: loans } = useLoans();

  // Mock user data - replace with actual user data from your auth system
  const userData = {
    name: "Sylus Abel",
    role: "DeFi Investor",
    accountId: "apcalbube97332hhdnexpmadeihwnm",
    email: "sylus@hashrexa.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate about DeFi and tokenized assets",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  };

  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />

      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account and view your DeFi statistics
        </p>
      </div>

      <div className="grid grid-cols-1 max-w-4xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 p-8 ">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={userData.profilePicture}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#ff9494] rounded-full border-2 border-white"></div>
              </div>
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {userData.name}
                </h2>
                <p className="text-lg text-gray-600 mb-1">Alpaca Account ID</p>
                <p className="text-gray-500">
                  {userData.accountId.slice(0, 6)}...
                  {userData.accountId.slice(-6)}
                </p>
              </div>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-12 py-2 rounded-3xl transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-3xl transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {userData.name.split(" ")[0]}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {userData.name.split(" ")[1]}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium">{userData.phone}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-between items-start">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600">
                    Bio
                  </label>
                  <p className="text-gray-900 font-medium">{userData.bio}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Financial Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Loans
                  </label>
                  <p className="text-gray-900 font-medium">
                    {loans?.length || 0}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Collateral
                  </label>
                  <p className="text-gray-900 font-medium">$4,000</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Borrowed
                  </label>
                  <p className="text-gray-900 font-medium">$1,000</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Interest
                  </label>
                  <p className="text-gray-900 font-medium">$100</p>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-between items-start">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600">
                    Loan Health
                  </label>
                  <p className="text-gray-900 font-medium">53%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between md:flex-row gap-4 mb-8">
            <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 p-6 w-full md:w-1/2">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Portfolio Value
                </p>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {portfolioData?.portfolioValueUSD?.toLocaleString() ||
                    "120,000"}
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  Trending up by 5.2% this month
                </p>
              </div>
            </div>

            <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 p-6 w-full md:w-1/2">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  Tokenized Assets
                </p>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                  {tokenizedAssets?.length || 75}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total tokenized assets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
