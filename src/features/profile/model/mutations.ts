import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { patchMyPagePublic, updateUserImage, updateUserNickname } from "@/entities/viewer/api";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";
import { useToast } from "@/shared/ui/toast";

export const useUserInfoMutation = () => {
  const navigate = useNavigate();
  const { openToast } = useToast();

  const update = useMutation({
    mutationFn: (formData: FormData) => updateUserImage(formData),
    onSuccess: () => {
      openToast("프로필 이미지 업데이트 성공");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
    },
  });

  const updateNickname = useMutation({
    mutationFn: (nickname: string) => updateUserNickname(nickname),
    onSuccess: () => {
      openToast("닉네임 설정 완료");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
      navigate("/mypage");
    },
  });

  return { update, updateNickname };
};

export const useUserMyPageMutation = () => {
  const { openToast } = useToast();
  const update = useMutation({
    mutationFn: async (isPublic: boolean) => {
      await patchMyPagePublic(isPublic);
      return isPublic;
    },
    onSuccess: (isPublic) => {
      openToast(isPublic ? "내 리뷰가 상대방에게 보입니다" : "내 리뷰가 상대방에게 보이지 않습니다");
    },
  });

  return { update };
};
