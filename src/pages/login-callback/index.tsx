import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthMutation } from "../../hooks/mutation/useAuthMutation";
import tw from "twin.macro";

const LoginCallbackPage = () => {
  const { id } = useParams();
  const { login } = useAuthMutation();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code && !login.isPending) {
      login.mutate({ id: id!, code: code });
    }
  }, [id]);

  return <Wrapper>로그인 작업 진행 중</Wrapper>;
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  w-full h-full
`;

export default LoginCallbackPage;
