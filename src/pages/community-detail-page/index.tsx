import { useParams } from "react-router-dom";
import { useArticleDetailQuery } from "../../hooks/queries/community";

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const { articleDetailQuery } = useArticleDetailQuery(id);

  console.log(articleDetailQuery.data);

  return <></>;
};
