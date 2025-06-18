import { useMutation } from "@tanstack/react-query";
import { patchMyPagePublic } from "../../api/user-my-page";
import { useToast } from "../../components/ToastProvider";

export const useUserMyPageMutation = () => {
  const { openToast } = useToast();
  const updateUserMyPageMutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      await patchMyPagePublic(isPublic);
      return isPublic;
    },
    onSuccess: (isPublic) => {
      openToast(isPublic ? "내 리뷰가 상대방에게 보입니다." : "내 리뷰가 상대방에게 보이지 않습니다.");
    },
  });

  return { updateUserMyPageMutation };
};
