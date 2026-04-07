import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag } from "@use-gesture/react";
import {
  type FilterOptions,
  OVERLAY_HEIGHTS,
  type OverlayHeightType,
  type Ramenya,
} from "@/entities/ramenya/model";
import RamenyaCard from "@/entities/ramenya/ui";
import { Line } from "@/shared/ui/line";
import NoStoreBox from "@/shared/ui/no-store-box";
import render from "@/shared/ui/render";
import FilterSection from "@/widgets/ramenya/filter-section";

interface ResultListOverlayProps {
  ramenyaList: Ramenya[];
  filterOptions: FilterOptions;
  setFilterOptions: (filterOptions: FilterOptions) => void;
  currentHeight: OverlayHeightType;
  setCurrentHeight: (height: OverlayHeightType) => void;
}

const dvhToPx = (dvh: string) => {
  const dvhValue = parseFloat(dvh.replace("dvh", ""));
  return (dvhValue / 100) * (window.visualViewport?.height || window.innerHeight);
};

const pxToDvh = (px: number) => {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  return `${(px / viewportHeight) * 100}dvh`;
};

export const ResultListOverlay = ({
  currentHeight,
  setCurrentHeight,
  ramenyaList,
  filterOptions,
  setFilterOptions,
}: ResultListOverlayProps) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [tempHeight, setTempHeight] = useState<string>(OVERLAY_HEIGHTS.COLLAPSED);
  const overlayRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ movement: [, movementY], canceled, last, memo = dvhToPx(currentHeight) }) => {
      if (canceled) {
        return;
      }

      setIsDragging(true);

      const deltaY = -movementY;
      let nextHeightPx = memo + deltaY;
      const minHeightPx = dvhToPx(OVERLAY_HEIGHTS.COLLAPSED);
      const maxHeightPx = dvhToPx(OVERLAY_HEIGHTS.EXPANDED);
      nextHeightPx = Math.max(minHeightPx, Math.min(maxHeightPx, nextHeightPx));

      setTempHeight(pxToDvh(nextHeightPx));

      if (last) {
        setIsDragging(false);

        const heights = [OVERLAY_HEIGHTS.COLLAPSED, OVERLAY_HEIGHTS.HALF, OVERLAY_HEIGHTS.EXPANDED];
        const heightPixels = heights.map((dvh) => dvhToPx(dvh));
        const closestHeightIndex = heightPixels.reduce(
          (prev, curr, index) => (Math.abs(curr - nextHeightPx) < Math.abs(heightPixels[prev] - nextHeightPx) ? index : prev),
          0,
        );

        const closestHeight = heights[closestHeightIndex] as OverlayHeightType;
        setCurrentHeight(closestHeight);
        setTempHeight(closestHeight);
      }
    },
    {
      axis: "y",
      filterTaps: true,
      preventDefault: true,
      from: () => [0, dvhToPx(currentHeight)],
    },
  );

  return (
    <Container
      ref={overlayRef}
      style={{
        height: isDragging ? tempHeight : currentHeight,
        transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <DragHandle {...bind()}>
        <DragIndicator />
      </DragHandle>

      <FilterSection
        sessionStorageKey="mapPageFilterOptions"
        filterOptions={filterOptions}
        onFilterChange={setFilterOptions}
      />

      <ListContentArea
        style={{
          height: isDragging ? `calc(${tempHeight} - 10px)` : `calc(${currentHeight} - 10px)`,
          overflowY: "auto",
        }}
      >
        {ramenyaList.map((ramenya) => (
          <ListItem key={ramenya._id}>
            <RamenyaCard {...ramenya} onClick={() => navigate(`/detail/${ramenya._id}`)} />
            <LineWrapper>
              <Line />
            </LineWrapper>
          </ListItem>
        ))}

        {ramenyaList.length === 0 && <NoStoreBox type="map" />}
      </ListContentArea>
    </Container>
  );
};

const Container = render.div(
  "absolute bottom-56 left-0 right-0 z-[110] flex flex-col overflow-hidden rounded-t-16 border border-solid border-divider/20 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.1)] [isolation:isolate] [transform:translateZ(0)] [will-change:transform]",
);

const DragHandle = render.div(
  "flex h-20 w-full touch-none select-none items-center justify-center cursor-grab touch-none active:cursor-grabbing",
);

const DragIndicator = render.div("h-4 w-36 rounded-full bg-divider");

const ListContentArea = render.div("hide-scrollbar flex-1 overflow-y-auto");

const ListItem = render.div("");

const LineWrapper = render.div("px-20");
