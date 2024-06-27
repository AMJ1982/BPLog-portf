import { languages } from '../languages/languages'
import { useSelector } from 'react-redux'

// A hook for sharing the relevant language object according to the language selection in Redux state.
// The objects are in ../languages/languages.js. The Redux state is controlled in LangMenu component.
export const useLanguage = () => {
  const lan = useSelector(state => state.lan)
  return languages[lan]
}
