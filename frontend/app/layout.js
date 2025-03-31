import './globals.css'
import ClientLayout from './ClientLayout'
export const metadata = {
  title: 'mostaCall',
  description: 'mostaCallApp',
}
// viewport 現在單獨導出
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 這裡嵌入客戶端布局 */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
