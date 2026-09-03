import type { Sale } from '../types/sale'

function closeWindow(printWindow: Window): void {
  if (!printWindow.closed) {
    printWindow.close()
  }
}

function triggerPrint(printWindow: Window): void {
  printWindow.focus()
  printWindow.addEventListener(
    'afterprint',
    () => {
      window.setTimeout(() => closeWindow(printWindow), 250)
    },
    { once: true },
  )
  window.setTimeout(() => printWindow.print(), 150)
}

export function printSale(sale: Sale, buildHtml: (sale: Sale) => string): void {
  const printWindow = window.open('', '_blank', 'width=960,height=1200')
  if (!printWindow) return

  const document = printWindow.document
  document.open()
  document.write(buildHtml(sale))
  document.close()

  const qrImage = document.querySelector(
    'img[data-qr="true"]',
  ) as HTMLImageElement | null
  if (qrImage && !qrImage.complete) {
    qrImage.onload = () => triggerPrint(printWindow)
    qrImage.onerror = () => triggerPrint(printWindow)
    return
  }

  triggerPrint(printWindow)
}
