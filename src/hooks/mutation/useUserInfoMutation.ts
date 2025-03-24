import { useMutation } from "@tanstack/react-query";
import { updateUserImage, updateUserNickname } from "../../api/auth";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../queries/queryKeys";
import { useNavigate } from "react-router-dom";

export const useUserInfoMutation = () => {
  const navigate = useNavigate();

  const userInfoMutation = useMutation({
    mutationFn: (formData: FormData) => updateUserImage(formData),
    onSuccess: () => {
      alert("프로필 이미지 업데이트 성공");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
    },
  });

  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) => updateUserNickname(nickname),
    onSuccess: () => {
      alert("닉네임 업데이트 성공");
      queryClient.invalidateQueries({
        ...queryKeys.user.information,
      });
      navigate("/mypage");
    },
  });

  return { userInfoMutation, updateNicknameMutation };
};
