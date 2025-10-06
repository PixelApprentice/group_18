import { LessonViewer } from "@/components/lesson-viewer"

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonViewer lessonId={Number.parseInt(params.id)} />
}
