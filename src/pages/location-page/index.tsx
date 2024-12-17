
import { useNavigate, useParams } from 'react-router-dom';
import tw from 'twin.macro';

export const LocationPage = () => {
    const {location} = useParams();
    const navigate = useNavigate();
  return (
    <Wrapper>
        <div>{location}</div>
        <div onClick={() => navigate("/detail/라멘야1")}>디테일페이지</div>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex flex-col gap-16 w-350
`;

export default LocationPage;