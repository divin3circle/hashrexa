import { BACKEND_URL } from "@/config";
import { UserPersonalInformation } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { useQuery } from "@tanstack/react-query";

export function usePersonalInformation() {
  const { address } = useAppKitAccount();
  if (!address) {
    throw new Error("User not connected");
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ["personalInformation"],
    queryFn: () => getPersonalInformation(address),
  });

  return { data, isLoading, error };
}

async function getPersonalInformation(
  address: string
): Promise<UserPersonalInformation> {
  const response = await fetch(
    `${BACKEND_URL}/personal-information/${address}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.personalInformation;
}
