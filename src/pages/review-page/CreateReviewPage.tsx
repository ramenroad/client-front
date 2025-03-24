import TopBar from '../../components/common/TopBar.tsx'
import tw from 'twin.macro'
import { IconStarLarge, IconAdd, IconClose } from '../../components/Icon/index.tsx'
import styled from '@emotion/styled'
import { createRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

// 폼 데이터 타입 정의
interface ReviewFormData {
    rating: number;
    menus: string[];
    description: string;
    images: string[];
}

export const CreateReviewPage = () => {
    // React Hook Form 설정
    const { control, handleSubmit, formState: { isValid, errors }, watch, setValue, register } = useForm<ReviewFormData>({
        defaultValues: {
            rating: 0,
            menus: [],
            description: '',
            images: []
        },
        mode: 'onChange' // 입력값이 변경될 때마다 유효성 검사
    });

    // 현재 폼 값들 관찰
    const formValues = watch();

    const [customMenuInput, setCustomMenuInput] = useState('');
    const [menuList, setMenuList] = useState(['라멘러ㅏ멘레ㅏ멘', '라멘', '라멘리ㅏㅔㅁㄴ라멘', '라멘', '라멘', '라멘리ㅏㅔㅁㄴ라멘', '라멘', '라멘']);

    // 파일 입력 참조 생성
    const fileInputRef = createRef<HTMLInputElement>();

    const handleStarClick = (index: number) => {
        setValue('rating', index, { shouldValidate: true });
    };

    const handleMenuClick = (menu: string) => {
        const currentMenus = formValues.menus;

        if (currentMenus.includes(menu)) {
            // 이미 선택된 메뉴라면 선택 해제
            setValue('menus', currentMenus.filter(item => item !== menu), { shouldValidate: true });
        } else {
            // 아직 선택되지 않은 메뉴라면 선택 (최대 2개까지)
            if (currentMenus.length < 2) {
                setValue('menus', [...currentMenus, menu], { shouldValidate: true });
            }
        }
    };

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const currentImages = formValues.images;

        // 최대 5개까지만 허용
        if (currentImages.length + files.length > 5) {
            alert('이미지는 최대 5개까지 업로드 가능합니다.');
            return;
        }

        // 파일을 미리보기 URL로 변환
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            if (currentImages.length + newImages.length >= 5) break;

            const file = files[i];
            if (file.type.startsWith('image/')) {
                newImages.push(URL.createObjectURL(file));
            }
        }

        setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
    };

    const handleImageClick = () => {
        // 이미지 개수가 5개 미만일 때만 파일 선택 대화상자 열기
        if (formValues.images.length < 5) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formValues.images];
        // 해당 URL 객체 해제
        URL.revokeObjectURL(newImages[index]);
        newImages.splice(index, 1);
        setValue('images', newImages, { shouldValidate: true });
    };

    const onSubmit = (data: ReviewFormData) => {
        // 폼 제출 처리
        console.log('제출된 리뷰 데이터:', data);
        // 여기서 API 호출 등을 통해 데이터를 서버로 전송할 수 있습니다
    };

    // 폼의 유효성 여부 확인
    const isFormValid = formValues.rating > 0 &&
        formValues.menus.length > 0 &&
        formValues.description.trim() !== '';

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
                                placeholder="메뉴 이름 입력"
                            />
                            <MenuAddButton onClick={handleAddCustomMenu} type="button">추가</MenuAddButton>
                        </MenuInputContainer>
                    </MenuAddWrapper>

                    <ReviewDescriptionWrapper>
                        <ReviewDescriptionTitle>어떤 점이 좋았나요?</ReviewDescriptionTitle>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <ReviewDescriptionTextarea
                                    {...field}
                                    placeholder="라멘의 맛, 분위기 등 자세한 리뷰를 남겨주세요."
                                />
                            )}
                        />
                        {errors.description && <ErrorMessage>리뷰 내용을 입력해주세요</ErrorMessage>}
                    </ReviewDescriptionWrapper>

                    <ImageUploadWrapper>
                        <ImageUploadHeader>
                            <ImageUploadTitleBox>
                                <ImageUploadTitle>사진 첨부</ImageUploadTitle>
                                <ImageCountBox>
                                    <ImageAdded>{formValues.images.length}</ImageAdded>
                                    <ImageAddedText>/</ImageAddedText>
                                    <ImageMax>5</ImageMax>
                                </ImageCountBox>
                            </ImageUploadTitleBox>
                            <ImageUploadSubTitle>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</ImageUploadSubTitle>
                        </ImageUploadHeader>

                        <ImageUploadContent>
                            <ImageUploadContentImage>
                                {/* 이미지 미리보기 */}
                                {formValues.images.map((image, index) => (
                                    <ImagePreviewContainer key={index}>
                                        <ImagePreview src={image} alt={`업로드 이미지 ${index + 1}`} />
                                        <ImageRemoveButton onClick={() => handleRemoveImage(index)} type="button">
                                            <IconClose width={9} height={9} />
                                        </ImageRemoveButton>
                                    </ImagePreviewContainer>
                                ))}

                                {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
                                {formValues.images.length < 5 && (
                                    <ImageAddButton onClick={handleImageClick} type="button">
                                        <IconAdd />
                                    </ImageAddButton>
                                )}

                                {/* 숨겨진 파일 입력 */}
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
        bg-orange
        border-orange
        text-white
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
    bg-border
    border-none
`

const MenuAddButton = tw.button`
    w-67 h-43 rounded-8 text-black
    px-10 py-8 bg-white
    border-solid border-1 border-gray-100
`

const ReviewDescriptionWrapper = tw.div`
    flex flex-col mt-32 gap-12
`

const ReviewDescriptionTitle = tw.div`
    font-16-m text-black
`

const ReviewDescriptionTextarea = tw.textarea`
    flex h-260 
    px-12 py-10
    rounded-8 bg-border
    border-none
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
















