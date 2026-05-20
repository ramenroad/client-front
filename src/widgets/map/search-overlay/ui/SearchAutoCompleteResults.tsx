import { getTextMatch } from '@/shared/lib/text'
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
          <KeywordTextGroup>
            <HighlightedText size={16} weight="sb">
              {getTextMatch({ query: keyword, target: keywordResult.name }).matchedText}
            </HighlightedText>
            <PlainText size={16} weight="sb">
              {getTextMatch({ query: keyword, target: keywordResult.name }).unMatchedText}
            </PlainText>
          </KeywordTextGroup>
        </KeywordWrapper>
      ))}

      {ramenyaResults.map((ramenyaResult) => (
        <KeywordWrapper key={ramenyaResult._id} onClick={() => onRamenyaSelect(ramenyaResult)}>
          <IconLocate color="#A0A0A0" />
          <KeywordTextGroup>
            <HighlightedText size={16} weight="sb">
              {getTextMatch({ query: keyword, target: ramenyaResult.name }).matchedText}
            </HighlightedText>
            <PlainText size={16} weight="sb">
              {getTextMatch({ query: keyword, target: ramenyaResult.name }).unMatchedText}
            </PlainText>
          </KeywordTextGroup>
        </KeywordWrapper>
      ))}
    </AutoCompleteContainer>
  )
}

const AutoCompleteContainer = render.div('flex flex-col')

const KeywordWrapper = render.button('flex items-center gap-8 h-36 cursor-pointer border-none bg-transparent px-0 text-left')

const KeywordTextGroup = render.span('')

const HighlightedText = render.extend(RaisingText, 'text-orange')

const PlainText = render.extend(RaisingText, '')
