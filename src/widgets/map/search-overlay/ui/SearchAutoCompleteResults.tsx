import { getTextMatchParts } from '@/shared/lib/text'
import { IconLocate } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface AutoCompleteItem {
  _id: string
  name: string
}

interface SearchAutoCompleteResultsProps {
  keyword: string
  keywordResults: AutoCompleteItem[]
  ramenyaResults: AutoCompleteItem[]
  onKeywordSelect: (keyword: string) => void
  onRamenyaSelect: (ramenya: AutoCompleteItem) => void
}

export const SearchAutoCompleteResults = ({
  keyword,
  keywordResults,
  ramenyaResults,
  onKeywordSelect,
  onRamenyaSelect,
}: SearchAutoCompleteResultsProps) => {
  return (
    <AutoCompleteContainer>
      {keywordResults.map((keywordResult) => (
        <KeywordWrapper key={keywordResult._id} onClick={() => onKeywordSelect(keywordResult.name)}>
          <IconLocate />
          <AutoCompleteMatchText keyword={keyword} target={keywordResult.name} />
        </KeywordWrapper>
      ))}

      {ramenyaResults.map((ramenyaResult) => (
        <KeywordWrapper key={ramenyaResult._id} onClick={() => onRamenyaSelect(ramenyaResult)}>
          <IconLocate color="#A0A0A0" />
          <AutoCompleteMatchText keyword={keyword} target={ramenyaResult.name} />
        </KeywordWrapper>
      ))}
    </AutoCompleteContainer>
  )
}

// 일치 구간만 주황색으로, 나머지는 원문 순서를 유지한 채(제자리 3분할) 렌더링한다.
const AutoCompleteMatchText = ({ keyword, target }: { keyword: string; target: string }) => {
  const { before, match, after } = getTextMatchParts({ query: keyword, target })

  return (
    <KeywordTextGroup>
      {before && (
        <PlainText size={16} weight="sb">
          {before}
        </PlainText>
      )}
      {match && (
        <HighlightedText size={16} weight="sb">
          {match}
        </HighlightedText>
      )}
      {after && (
        <PlainText size={16} weight="sb">
          {after}
        </PlainText>
      )}
    </KeywordTextGroup>
  )
}

const AutoCompleteContainer = render.div('flex flex-col')

const KeywordWrapper = render.button('flex items-center gap-8 h-36 cursor-pointer border-none bg-transparent px-0 text-left')

const KeywordTextGroup = render.span('')

const HighlightedText = render.extend(RaisingText, 'text-orange')

const PlainText = render.extend(RaisingText, '')
