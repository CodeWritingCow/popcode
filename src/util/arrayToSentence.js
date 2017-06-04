import {t} from 'i18next';
import arrayToSentence from 'array-to-sentence';

export function localizedArrayToSentence(array) {
  return arrayToSentence(array, {lastSeparator: t('utility.or')});
}
