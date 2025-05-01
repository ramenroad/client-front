import tw from 'twin.macro'

interface ReviewImageProps {
    image: string;
    onClick?: () => void;
}

export const ReviewImage = ({ image, onClick }: ReviewImageProps) => {
    return (
        <Image src={image} onClick={onClick} />
    )
}

const Image = tw.img`
    w-full h-full object-cover
    cursor-pointer
`;

