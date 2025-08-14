import { PageWrapper } from '@/components/page-wrapper'
import RichTextEditor from '@/components/rich-text-editor'
import { getNoteById } from '@/server/notes'

type Params = Promise<{
  noteId: string
}>

export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params

  const { note } = await getNoteById(noteId)

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: note?.title ?? 'Note', href: `/dashboard/note/${noteId}` },
      ]}
    >
      <h1>{note?.title}</h1>

      <RichTextEditor content={note?.content} noteId={note?.id} />
    </PageWrapper>
  )
}
