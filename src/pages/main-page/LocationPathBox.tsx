import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro'

interface LocationPathBoxProps {
    location: string;
}

export const LocationPathBox = ({location}: LocationPathBoxProps) => {
const navigate = useNavigate();
  return (
    <Wrapper onClick={() => navigate(`/location/${location}`)}>
        <LocationPathText>{location}</LocationPathText>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex items-center justify-center
  border-solid border-1 border-divider
  rounded-4 
  w-110 h-50
  cursor-pointer
  hover:(bg-orange text-white)
  active:(bg-orange text-white)
`;

const LocationPathText = tw.div`
  flex font-14-r 
`;