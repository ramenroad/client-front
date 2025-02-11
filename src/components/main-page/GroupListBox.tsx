import tw from 'twin.macro'

interface GroupListBoxProps {
 title: string
 subTitle: string
 image: string
 onClick: () => void
}

export const GroupListBox = ({ title, subTitle, image, onClick }: GroupListBoxProps) => {
  return (
    <Wrapper onClick={onClick}>
        <GroupListImage src={image} />
        <TextBox>
            <GroupListTitle>{title}</GroupListTitle>
            <GroupListSubTitle>{subTitle}</GroupListSubTitle>
        </TextBox>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex flex-col cursor-pointer
  gap-10
`;

const GroupListImage = tw.img`
  w-160 h-160 rounded-8
`;

const GroupListTitle = tw.span`
  font-16-m text-black
`;

const GroupListSubTitle = tw.span`
  font-14-r text-gray-700
`;

const TextBox = tw.div`
  flex flex-col 
`;