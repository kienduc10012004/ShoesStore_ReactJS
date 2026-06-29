let confirmHandler = null

export const registerConfirmHandler = (handler) => {
  confirmHandler = handler

  return () => {
    if (confirmHandler === handler) {
      confirmHandler = null
    }
  }
}

export const showConfirm = (options) => {
  if (!confirmHandler) {
    return Promise.resolve(window.confirm(options?.message || String(options || '')))
  }

  return confirmHandler(
    typeof options === 'string'
      ? {
          message: options,
        }
      : options
  )
}
