import { UserPersonalInformation } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function usePersonalInformation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["personalInformation"],
    queryFn: () => getPersonalInformation(),
  });

  return { data, isLoading, error };
}

export function useSetPersonalInformation() {
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (personalInformation: UserPersonalInformation) =>
      setPersonalInformation(personalInformation),
  });

  return { mutate, isLoading, error };
}

async function getPersonalInformation() {}

async function setPersonalInformation(
  personalInformation: UserPersonalInformation
) {
  console.log(personalInformation);
}
