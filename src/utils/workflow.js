const workflowData = {
  'flowchart': {
    'localedit': {
      'urrd': [
        { label: 'Сохранить и продолжить', color: 'orange', emit: 'clickBtnSaveAndContinue' },
        { label: 'Сохранить как черновик', color: 'orange', emit: 'clickBtnSaveDraft' },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ]
    },
    'draft': {
      'urrd': [
        { label: 'На согласование в ОРРД', emit: 'clickBtnAgreedORRD' },
        { label: 'Сохранить и продолжить', color: 'orange', emit: 'clickBtnSaveAndContinue' },
        { label: 'Сохранить как черновик', color: 'orange', emit: 'clickBtnSaveDraft' },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ]
    },
    'create': {
      'urrd': [
        { label: 'Сохранить и продолжить', color: 'orange', emit: 'clickBtnSaveAndContinue' },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ]
    },
    'work': {
      'urrd': [
        { label: 'На согласование в ОРРД', emit: 'clickBtnAgreedORRD' },
        { label: 'Сохранить и продолжить', color: 'orange', emit: 'clickBtnSaveСontinue' },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ]
    },
    'wait': {
      'urrd': [
        { label: 'На согласование в ОРРД', emit: 'clickBtnAgreedORRD' },
        { label: 'Сохранить и продолжить', color: 'orange', emit: 'clickBtnSaveСontinue' },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ]
    }
  }
}
/*
[
  {
    label: 'На корректировку',
    color: 'orange',
    emit: 'clickBtnCorrection'
  },
  {
    label: 'Предварительный просмотр',
    color: 'blue',
    emit: 'clickBtnPreview'
  },
  { label: 'На согласование', emit: 'clickBtnAgreed' },

  { label: 'Отправить', emit: 'clickBtnSend' },
  { label: 'Сохранить', color: 'orange', emit: 'clickBtnSave' },
  {
    label: 'Вернуться в статус "черновик"',
    emit: 'clickBtnReturnDraftStatus'
  },
  {
    label: 'Отправить на исполнение',
    color: 'orange',
    emit: 'clickBtnSendExecution'
  },
  {
    label: 'Сохранить и продолжить',
    color: 'orange',
    emit: 'clickBtnSaveСontinue'
  },
  {
    label: 'Сохранить как черновик',
    color: 'orange',
    emit: 'clickBtnSaveDraft'
  },
  { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' },
  { label: 'Отменить заявку', color: 'grey', emit: 'clickBtnDeclined' },
  { label: 'Согласовать', emit: 'clickBtnApprove' },
  { label: 'Скачать PDF', color: 'blue', emit: 'clickBtnDownloadPDF' },
  { label: 'В работу', color: 'orange', emit: 'clickBtnWork' }
]*/
import store from '@/store'
const roleName = store.state.user.role_name
const workflow = {
  getButton(section, currentStatus) {
    return workflowData[section][currentStatus][roleName]
  },
  changeStatus(type, object_id, status) {
    return false
  }
}

export default workflow
