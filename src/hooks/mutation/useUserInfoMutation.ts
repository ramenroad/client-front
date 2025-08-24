import { useMutation } from "@tanstack/react-query";
import { updateUserImage, updateUserNickname } from "../../api/auth";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../queries/queryKeys";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/toast/ToastProvider";

export const useUserInfoMutation = () => {
  const navigate = useNavigate();
  const { openToast } = useToast();

  const userInfoMutation = useMutation({
    mutationFn: (formData: FormData) => updateUserImage(formData),
    onSuccess: () => {
      openToast("프로필 이미지 업데이트 성공");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
    },
  });

  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) => updateUserNickname(nickname),
    onSuccess: () => {
      openToast("닉네임 설정 완료");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
      navigate("/mypage");
    },
  });

  return { userInfoMutation, updateNicknameMutation };
};
