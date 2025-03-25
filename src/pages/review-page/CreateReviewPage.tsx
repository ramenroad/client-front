import TopBar from '../../components/common/TopBar.tsx'
import tw from 'twin.macro'
import { IconStarLarge, IconAdd, IconClose } from '../../components/Icon/index.tsx'
import styled from '@emotion/styled'
import { createRef, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Review } from '../../types'
import { useRamenyaReviewMutation } from '../../hooks/queries/useRamenyaReviewQuery.ts'
import { useNavigate } from 'react-router-dom';

export const CreateReviewPage = () => {
    const { mutate: createReview } = useRamenyaReviewMutation();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<Review>({
        defaultValues: {
            ramenyaId: '',
            rating: 0,
            review: '',
            reviewImageUrls: [],
            menus: []
        },
        mode: 'onChange'
    });

    const formValues = watch();

    const [customMenuInput, setCustomMenuInput] = useState('');
    const [menuList, setMenuList] = useState([
        '라멘1',
        '라멘2',
        '라멘3',
        '라멘4',
        '라멘5',
        '라멘6',
        '라멘7',
    ]);

    const fileInputRef = createRef<HTMLInputElement>();

    // handle Rating 
    const handleStarClick = (index: number) => {
        setValue('rating', index, { shouldValidate: true });
    };

    // handle Menu
    const handleMenuClick = (menu: string) => {
        const currentMenus = formValues.menus;

        if (currentMenus.includes(menu)) {
            setValue('menus', currentMenus.filter(item => item !== menu), { shouldValidate: true });
        } else {
            if (currentMenus.length < 2) {
                setValue('menus', [...currentMenus, menu], { shouldValidate: true });
            }
        }
    };

    // handle Add Custom Menu
    const handleAddCustomMenu = () => {
        if (customMenuInput.trim() !== '' && !menuList.includes(customMenuInput)) {
            setMenuList([...menuList, customMenuInput]);
            setCustomMenuInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddCustomMenu();
        }
    };

    // handle Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const currentImages = formValues.reviewImageUrls || [];

        if (currentImages.length + files.length > 5) {
            alert('이미지는 최대 5개까지 업로드 가능합니다.');
            return;
        }

        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            if (currentImages.length + newImages.length >= 5) break;

            const file = files[i];
            if (file.type.startsWith('image/')) {
                newImages.push(URL.createObjectURL(file));
            }
        }

        setValue('reviewImageUrls', [...currentImages, ...newImages], { shouldValidate: true });
    };

    const handleImageClick = () => {
        if ((formValues.reviewImageUrls?.length ?? 0) < 5) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formValues.reviewImageUrls || []];
        URL.revokeObjectURL(newImages[index]);
        newImages.splice(index, 1);
        setValue('reviewImageUrls', newImages, { shouldValidate: true });
    };

    const onSubmit = (data: Review) => {
        createReview(data);
        navigate(-1);
    };

    const isFormValid = formValues.rating > 0 &&
        formValues.menus.length > 0 &&
        formValues.review.trim().length >= 10;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Wrapper>
            <Header>
                <TopBar title="리뷰 작성하기" />
            </Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ContentsWrapper>
                    <StarWrapper>
                        <StarTitle>라멘은 만족하셨나요?</StarTitle>
                        <StarContainer>
                            {[1, 2, 3, 4, 5].map((starIndex) => (
                                <StarButton
                                    key={starIndex}
                                    onClick={() => handleStarClick(starIndex)}
                                    type="button"
                                >
                                    <IconStarLarge color={starIndex <= formValues.rating ? "#FFCC00" : "#E1E1E1"} />
                                </StarButton>
                            ))}
                        </StarContainer>
                        {errors.rating && <ErrorMessage>별점을 선택해주세요</ErrorMessage>}
                    </StarWrapper>
                    <Divider />

                    <MenuWrapper>
                        <MenuTitleBox>
                            <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
                            <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
                        </MenuTitleBox>
                        <MenuTabContainer>
                            {menuList.map((menu, index) => (
                                <MenuTab
                                    key={index}
                                    selected={formValues.menus.includes(menu)}
                                    onClick={() => handleMenuClick(menu)}
                                >
                                    {menu}
                                </MenuTab>
                            ))}
                        </MenuTabContainer>
                        {errors.menus && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
                    </MenuWrapper>

                    <MenuAddWrapper>
                        <MenuAddTitle>찾으시는 메뉴가 없나요? 직접 추가해주세요</MenuAddTitle>
                        <MenuInputContainer>
                            <MenuInput
                                value={customMenuInput}
                                onChange={(e) => setCustomMenuInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="메뉴명을 입력해주세요"
                            />
                            <MenuAddButton onClick={handleAddCustomMenu} type="button">추가</MenuAddButton>
                        </MenuInputContainer>
                    </MenuAddWrapper>

                    <ReviewDescriptionWrapper>
                        <ReviewDescriptionTitle>어떤 점이 좋았나요?</ReviewDescriptionTitle>
                        <Controller
                            name="review"
                            control={control}
                            rules={{ required: true, minLength: 10 }}
                            render={({ field }) => (
                                <ReviewTextAreaContainer>
                                    <ReviewDescriptionTextarea
                                        {...field}
                                        placeholder="최소 10자 이상 입력해주세요"
                                    />
                                    <CharacterCount>
                                        <TypedCount>{field.value.length}</TypedCount>/300
                                    </CharacterCount>
                                </ReviewTextAreaContainer>
                            )}
                        />
                        {/* {errors.review && errors.review.type === 'required' &&
                            <ErrorMessage>리뷰 내용을 입력해주세요</ErrorMessage>}
                        {errors.review && errors.review.type === 'minLength' &&
                            <ErrorMessage>최소 10자 이상 입력해주세요</ErrorMessage>} */}
                    </ReviewDescriptionWrapper>

                    <ImageUploadWrapper>
                        <ImageUploadHeader>
                            <ImageUploadTitleBox>
                                <ImageUploadTitle>사진 첨부</ImageUploadTitle>
                                <ImageCountBox>
                                    <ImageAdded>{formValues.reviewImageUrls?.length}</ImageAdded>
                                    <ImageAddedText>/</ImageAddedText>
                                    <ImageMax>5</ImageMax>
                                </ImageCountBox>
                            </ImageUploadTitleBox>
                            <ImageUploadSubTitle>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</ImageUploadSubTitle>
                        </ImageUploadHeader>

                        <ImageUploadContent>
                            <ImageUploadContentImage>
                                {formValues.reviewImageUrls?.map((image, index) => (
                                    <ImagePreviewContainer key={index}>
                                        <ImagePreview src={image} alt={`업로드 이미지 ${index + 1}`} />
                                        <ImageRemoveButton onClick={() => handleRemoveImage(index)} type="button">
                                            <IconClose width={9} height={9} />
                                        </ImageRemoveButton>
                                    </ImagePreviewContainer>
                                ))}
                                {(formValues.reviewImageUrls?.length ?? 0) < 5 && (
                                    <ImageAddButton onClick={handleImageClick} type="button">
                                        <IconAdd />
                                    </ImageAddButton>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                />
                            </ImageUploadContentImage>
                        </ImageUploadContent>
                    </ImageUploadWrapper>

                    <AddReviewButton
                        active={isFormValid}
                        onClick={isFormValid ? handleSubmit(onSubmit) : undefined}
                        type="submit"
                        disabled={!isFormValid}
                    >
                        등록하기
                    </AddReviewButton>
                </ContentsWrapper>
            </form>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40
`

const Header = tw.div`
`

const ContentsWrapper = tw.div`
    flex flex-col
    px-20
`

const StarWrapper = tw.div`
    flex flex-col
    items-center
    pt-20
    pb-32
    gap-12
`

const StarTitle = tw.div`
    font-16-m text-black
`

const StarContainer = tw.div`
    flex gap-8 items-center
`

const Divider = tw.div`
    w-full h-1 bg-divider
`

const MenuWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const MenuTitleBox = tw.div`
    flex items-center
    gap-4
`

const MenuTitle = tw.div`
    font-16-m text-black
`

const MenuSubTitle = tw.div`
    font-12-r text-gray-400
`

const MenuTabContainer = tw.div`
    flex flex-wrap gap-8
`

interface MenuTabProps {
    selected: boolean
}

const MenuTab = styled.div<MenuTabProps>(({ selected }) => [
    tw`
    flex w-fit h-29 box-border
    items-center
    bg-white
    border-solid border-1 border-gray-400
    font-14-m text-gray-400
    py-4 px-12 rounded-50
    cursor-pointer
    `,
    selected && tw`
        border-orange
        text-orange
    `
])

const MenuAddWrapper = tw.div`
    flex flex-col mt-20 gap-12
`

const MenuAddTitle = tw.div`
    font-14-r text-black
`

const MenuInputContainer = tw.div`
    flex items-center gap-4
`

const MenuInput = tw.input`
    flex-1 h-44 rounded-8 
    bg-border box-border
    border-none
    px-12 py-10
    font-16-r
`

const MenuAddButton = tw.button`
    w-67 h-43 rounded-8 text-black
    px-10 py-8 bg-white
    border-solid border-1 border-gray-100
`

const ReviewDescriptionWrapper = tw.div`
    flex flex-col mt-32 gap-12
    relative
`

const ReviewDescriptionTitle = tw.div`
    font-16-m text-black
`

const ReviewTextAreaContainer = tw.div`
    flex flex-col gap-4 relative
    bg-border
    rounded-8
    px-12 pt-10
    pb-36
`

const ReviewDescriptionTextarea = styled.textarea`
    ${tw`
        flex h-214 w-full 
        bg-transparent
        border-none
        font-16-r
    `}
    
    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #D9D9D9;
        border-radius: 3px;
    }

`

// 글자 수 표시 스타일
const CharacterCount = tw.div`
    absolute bottom-14 right-12
    font-14-r text-gray-400
`

const TypedCount = tw.span`
    font-14-r text-black
`


const ImageUploadWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const ImageUploadHeader = tw.div`
    flex flex-col gap-2
`

const ImageUploadTitleBox = tw.div`
    flex items-center gap-8
`

const ImageUploadTitle = tw.div`
    font-16-m text-black
`

const ImageCountBox = tw.div`
    flex items-center
`

const ImageAdded = tw.div`
    font-16-m text-black
`

const ImageAddedText = tw.div`
    font-16-m text-black
`

const ImageMax = tw.div`
    font-16-m text-black
`

const ImageUploadSubTitle = tw.div`
    font-12-r text-gray-400
`

const ImageUploadContent = tw.div`
    flex flex-col gap-12
`

const ImageUploadContentImage = tw.div`
    flex flex-row flex-wrap gap-12
`

const ImagePreviewContainer = tw.div`
    relative
    w-96 h-96
    rounded-8
    overflow-visible
    border-solid border-1 border-gray-200
`

const ImagePreview = tw.img`
    w-full h-full
    object-cover
`

const ImageRemoveButton = tw.button`
    absolute top-[-8px] right-[-8px]
    w-24 h-24
    flex items-center justify-center
    bg-white
    rounded-full
    cursor-pointer
    shadow-md
    border-solid border-1 border-gray-200
    z-10
`

const ImageAddButton = tw.button`
    flex items-center justify-center
    w-96 h-96 rounded-8 bg-border
    border-solid border-1 border-gray-200
    border-dashed
    cursor-pointer
`

interface AddReviewButtonProps {
    active: boolean;
    disabled?: boolean;
}

const AddReviewButton = styled.button<AddReviewButtonProps>(({ active }) => [
    tw`
    flex items-center justify-center
    mt-32
    w-full h-48 rounded-8 text-white
    px-10 py-10 bg-gray-200
    border-none box-border
    `,
    active && tw`bg-orange cursor-pointer`,
    !active && tw`cursor-not-allowed`
])

const StarButton = tw.button`
    bg-transparent border-none cursor-pointer p-0 m-0
`

const ErrorMessage = tw.div`
    font-12-r text-red
    mt-4
`

















