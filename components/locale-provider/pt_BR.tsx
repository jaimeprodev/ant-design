import * as moment from 'moment';
moment.locale('pt-br');

import Pagination from 'rc-pagination/lib/locale/pt_BR';
import DatePicker from '../date-picker/locale/pt_BR';
import TimePicker from '../time-picker/locale/pt_BR';
import Calendar from '../calendar/locale/pt_BR';

export default {
  locale: 'pt-br',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Filtro',
    filterConfirm: 'OK',
    filterReset: 'Resetar',
    emptyText: 'Não há dados',
    selectAll: 'Selecionar página atual',
    selectInvert: 'Inverter seleção',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancelar',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancelar',
  },
  Transfer: {
    notFoundContent: 'Não encontrado',
    searchPlaceholder: 'Procurar',
    itemUnit: 'item',
    itemsUnit: 'items',
  },
  Select: {
    notFoundContent: 'Não encontrado',
  },
  Upload: {
    uploading: 'Enviando...',
    removeFile: 'Remover arquivo',
    uploadError: 'Erro no envio',
    previewFile: 'Visualizar arquivo',
  },
};
