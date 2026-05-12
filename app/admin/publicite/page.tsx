import AdminPubliciteClient from './AdminPubliciteClient'

export const metadata = {
  title: 'Publicité — Administration SOARA',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminPubliciteClient />
}
