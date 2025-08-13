import { Logout } from '@/components/logout'
import { PageWrapper } from '@/components/page-wrapper'

export default function Dashboard() {
  return (
    <PageWrapper breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}>
      <h1>Dashboard</h1>
      <Logout />
    </PageWrapper>
  )
}
