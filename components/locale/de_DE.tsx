import Pagination from 'rc-pagination/lib/locale/de_DE';
import DatePicker from '../date-picker/locale/de_DE';
import TimePicker from '../time-picker/locale/de_DE';
import Calendar from '../calendar/locale/de_DE';
import { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'de',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Filter-Menü',
    filterConfirm: 'OK',
    filterReset: 'Zurücksetzen',
    selectAll: 'Selektiere Alle',
    selectInvert: 'Selektion Invertieren',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Abbrechen',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Abbrechen',
  },
  Transfer: {
    searchPlaceholder: 'Suchen',
    itemUnit: 'Eintrag',
    itemsUnit: 'Einträge',
  },
  Upload: {
    uploading: 'Hochladen...',
    removeFile: 'Datei entfernen',
    uploadError: 'Fehler beim Hochladen',
    previewFile: 'Dateivorschau',
    downloadFile: 'Download-Datei',
  },
  Empty: {
    description: 'Keine Daten',
  },
};

export default localeValues;
