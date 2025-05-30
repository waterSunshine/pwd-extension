import { EAction, type TAction, type TFormItemData } from './types'

// @ts-ignore
chrome.runtime.onMessage.addListener((message: TAction, sender, sendResponse) => {
  console.log('🚀 ~ chrome.runtime.onMessage.addListener ~ message:', message)
  if (message.action === EAction.FILL) {
    const data = Array.isArray(message.data)
      ? message.data
      : (Object.values(message.data || {}) as TFormItemData[])
    data.forEach((item) => {
      const element = document.querySelector(item.trigger) as HTMLInputElement | HTMLSelectElement
      const elementType = element.tagName.toLowerCase()
      if (!element) {
        return
      }
      let lastValue = element.value
      element.value = item.value
      let event = new Event(elementType, { bubbles: true })
      // @ts-ignore hack React15
      event.simulated = true
      // @ts-ignore hack React16 内部定义了 descriptor 拦截 value，此处重置状态
      let tracker = element._valueTracker
      if (tracker) {
        tracker.setValue(lastValue)
      }
      element.dispatchEvent(event)
    })
  }
})

console.log('🚀 ~ content.ts ~ content.ts')
