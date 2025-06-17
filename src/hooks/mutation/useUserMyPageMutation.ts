import { useMutation } from "@tanstack/react-query";
import { patchMyPagePublic } from "../../api/user-my-page";
import { useToast } from "../../components/ToastProvider";

export const useUserMyPageMutation = () => {
  const { openToast } = useToast();
  const updateUserMyPageMutation = useMutation({
    mutationFn: patchMyPagePublic,
    onSuccess: () => {
      openToast("리뷰 공개 여부가 변경되었습니다.");
    },
  });

  return { updateUserMyPageMutation };
};
