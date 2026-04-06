use strict;
use warnings;
use File::Find;

my @replacements = (
  [qr{(?:\.\./)+(?:components/)?common/Button(?:\.tsx)?}, '@/shared/ui/button'],
  [qr{(?:\.\./)+(?:components/)?common/Line(?:\.tsx)?}, '@/shared/ui/line'],
  [qr{(?:\.\./)+(?:components/)?common/Modal(?:\.tsx)?}, '@/shared/ui/modal'],
  [qr{(?:\.\./)+(?:components/)?common/RamenroadText(?:\.tsx)?}, '@/shared/ui/text'],
  [qr{(?:\.\./)+(?:components/)?top-bar(?:/index)?(?:\.tsx)?}, '@/shared/ui/top-bar'],
  [qr{(?:\.\./)+(?:components/)?Icon(?:/index)?(?:\.tsx)?}, '@/shared/ui/icon'],
  [qr{(?:\.\./)+(?:components/)?common/Toggle(?:\.tsx)?}, '@/shared/ui/toggle'],
  [qr{(?:\.\./)+(?:components/)?common/Tooltip(?:\.tsx)?}, '@/shared/ui/tooltip'],
  [qr{(?:\.\./)+(?:components/)?app-bar(?:/index)?(?:\.tsx)?}, '@/widgets/navigation/app-bar'],
  [qr{(?:\.\./)+(?:components/)?common/Footer(?:\.tsx)?}, '@/widgets/footer'],
  [qr{(?:\.\./)+(?:components/)?map/SearchOverlay(?:\.tsx)?}, '@/widgets/map/search-overlay'],
  [qr{(?:\.\./)+(?:components/)?map/NaverMap(?:\.tsx)?}, '@/widgets/map/naver-map'],
  [qr{(?:\.\./)+(?:components/)?filter/FilterSection(?:\.tsx)?}, '@/widgets/ramenya/filter-section'],
  [qr{(?:\.\./)+(?:components/)?review/ReviewCard(?:\.tsx)?}, '@/entities/review/ui'],
  [qr{(?:\.\./)+(?:components/)?ramenya-card/RamenyaCard(?:\.tsx)?}, '@/entities/ramenya/ui'],
  [qr{(?:\.\./)+(?:components/)?banner(?:/index)?(?:\.tsx)?}, '@/entities/curation/ui'],
  [qr{(?:\.\./)+(?:components/)?toast/ToastProvider(?:\.tsx)?}, '@/shared/ui/toast'],
  [qr{(?:\.\./)+(?:components/)?popup/ImagePopup(?:\.tsx)?}, '@/shared/ui/image-popup'],
  [qr{(?:\.\./)+(?:components/)?no-data/NoStoreBox(?:\.tsx)?}, '@/shared/ui/no-store-box'],
  [qr{(?:\.\./)+(?:components/)?no-data/NoResultBox(?:\.tsx)?}, '@/shared/ui/no-result-box'],
  [qr{(?:\.\./)+(?:components/)?tag(?:/index)?(?:\.tsx)?}, '@/shared/ui/tag'],
  [qr{(?:\.\./)+hooks/common/useModal(?:\.tsx)?}, '@/shared/lib/use-modal'],
  [qr{(?:\.\./)+hooks/common/useDebounce(?:\.tsx)?}, '@/shared/lib/use-debounce'],
  [qr{(?:\.\./)+hooks/common/useIntersectionObserver(?:\.tsx)?}, '@/shared/lib/use-intersection-observer'],
  [qr{(?:\.\./)+hooks/common/useMobileState(?:\.tsx)?}, '@/shared/lib/use-mobile-state'],
  [qr{(?:\.\./)+hooks/common/useScrollToTop(?:\.tsx)?}, '@/shared/lib/use-scroll-to-top'],
  [qr{(?:\.\./)+hooks/common/usePopup(?:\.tsx)?}, '@/shared/lib/use-popup'],
  [qr{(?:\.\./)+hooks/common/useUserLocation(?:\.tsx)?}, '@/shared/lib/use-user-location'],
  [qr{(?:\.\./)+hooks/common/useMapLocation(?:\.tsx)?}, '@/shared/lib/use-map-location'],
  [qr{(?:\.\./)+hooks/common/useMapSearch(?:\.tsx)?}, '@/shared/lib/use-map-search'],
  [qr{(?:\.\./)+hooks/common/usePageMemorize(?:\.tsx)?}, '@/shared/lib/use-page-memorize'],
  [qr{(?:\.\./)+hooks/common/useKakaoSDK(?:\.tsx)?}, '@/shared/lib/use-kakao-sdk'],
  [qr{(?:\.\./)+hooks/queries/queryKeys(?:\.ts)?}, '@/shared/model/query-keys'],
  [qr{(?:\.\./)+hooks/queries/useBannerQuery(?:\.ts)?}, '@/entities/curation/model'],
  [qr{(?:\.\./)+hooks/queries/useRamenyaGroupQuery(?:\.ts)?}, '@/entities/curation/model'],
  [qr{(?:\.\./)+hooks/queries/useRamenyaDetailQuery(?:\.ts)?}, '@/entities/ramenya/model'],
  [qr{(?:\.\./)+hooks/queries/useRamenyaListQuery(?:\.ts)?}, '@/entities/ramenya/model'],
  [qr{(?:\.\./)+hooks/queries/useRamenyaReviewQuery(?:\.ts)?}, '@/entities/review/model'],
  [qr{(?:\.\./)+hooks/queries/useUserInformationQuery(?:\.ts)?}, '@/entities/viewer/model'],
  [qr{(?:\.\./)+hooks/queries/useUserMyPageQuery(?:\.ts)?}, '@/entities/viewer/model'],
  [qr{(?:\.\./)+hooks/queries/useSearchQuery(?:\.ts)?}, '@/features/search/model'],
  [qr{(?:\.\./)+hooks/mutation/useAuthMutation(?:\.ts)?}, '@/features/auth/model'],
  [qr{(?:\.\./)+hooks/mutation/useMenuBoardMutation(?:\.ts)?}, '@/features/menu-board/model'],
  [qr{(?:\.\./)+hooks/mutation/useUserInfoMutation(?:\.ts)?}, '@/features/profile/model'],
  [qr{(?:\.\./)+hooks/mutation/useUserMyPageMutation(?:\.ts)?}, '@/features/profile/model'],
  [qr{(?:\.\./)+hooks/mutation/useSearchHistoryMutation(?:\.ts)?}, '@/features/search/model'],
  [qr{(?:\.\./)+states/sign-in(?:\.ts)?}, '@/entities/viewer/model'],
  [qr{(?:\.\./)+store/location/useUserInformationStore(?:\.ts)?}, '@/entities/viewer/model'],
  [qr{(?:\.\./)+store/location/useLocationStore(?:\.ts)?}, '@/entities/location/model'],
  [qr{(?:\.\./)+api/auth(?:/index)?(?:\.ts)?}, '@/entities/viewer/api'],
  [qr{(?:\.\./)+api/user-my-page(?:/index)?(?:\.ts)?}, '@/entities/viewer/api'],
  [qr{(?:\.\./)+api/banner(?:/index)?(?:\.ts)?}, '@/entities/curation/api'],
  [qr{(?:\.\./)+api/group(?:/index)?(?:\.ts)?}, '@/entities/curation/api'],
  [qr{(?:\.\./)+api/detail-page(?:/index)?(?:\.ts)?}, '@/entities/ramenya/api'],
  [qr{(?:\.\./)+api/list-page(?:/index)?(?:\.ts)?}, '@/entities/ramenya/api'],
  [qr{(?:\.\./)+api/map(?:/index)?(?:\.ts)?}, '@/entities/ramenya/api'],
  [qr{(?:\.\./)+api/menu-board(?:/index)?(?:\.ts)?}, '@/entities/menu-board/api'],
  [qr{(?:\.\./)+api/review(?:/index)?(?:\.ts)?}, '@/entities/review/api'],
  [qr{(?:\.\./)+types/user(?:/index)?(?:\.ts)?}, '@/entities/viewer/model'],
  [qr{(?:\.\./)+types/filter(?:/index)?(?:\.ts)?}, '@/entities/ramenya/model'],
  [qr{(?:\.\./)+types/review(?:/index)?(?:\.ts)?}, '@/entities/review/model'],
  [qr{(?:\.\./)+constants(?:/index)?(?:\.ts)?}, '@/entities/ramenya/model'],
  [qr{(?:\.\./)+util/image(?:\.ts)?}, '@/shared/lib/image'],
  [qr{(?:\.\./)+util/number(?:\.ts)?}, '@/shared/lib/number'],
  [qr{(?:\.\./)+util/map(?:/index)?(?:\.ts)?}, '@/shared/lib/map'],
);

find(
  {
    no_chdir => 1,
    wanted => sub {
    return unless -f $_;
    return unless /\.(ts|tsx)$/;

    my $path = $File::Find::name;
    open my $fh, '<', $path or die "Cannot read $path: $!";
    local $/;
    my $content = <$fh>;
    close $fh;

    my $updated = $content;

    for my $replacement (@replacements) {
      my ($pattern, $target) = @$replacement;
      $updated =~ s/$pattern/$target/g;
    }

    return if $updated eq $content;

    open my $out, '>', $path or die "Cannot write $path: $!";
    print {$out} $updated;
    close $out;
  },
  },
  'src'
);
