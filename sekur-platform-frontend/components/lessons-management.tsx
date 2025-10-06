"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { adminApi, lessonsApi } from "@/lib/api"
import type { Lesson } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function LessonsManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const { toast } = useToast()

  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
  })

  const fetchLessons = async () => {
    try {
      const data = await lessonsApi.getAll()
      setLessons(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  const handleCreateLesson = async () => {
    try {
      await adminApi.createLesson(newLesson.title, newLesson.content)
      toast({
        title: "Success",
        description: "Lesson created successfully",
      })
      setIsCreateDialogOpen(false)
      setNewLesson({ title: "", content: "" })
      fetchLessons()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lesson",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLesson = async () => {
    if (!editingLesson) return

    try {
      await adminApi.updateLesson(editingLesson.id, {
        title: editingLesson.title,
        content: editingLesson.content,
      })
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      })
      setEditingLesson(null)
      fetchLessons()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lesson",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    try {
      await adminApi.deleteLesson(lessonId)
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      })
      fetchLessons()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lesson",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading lessons...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessons Management</h1>
          <p className="text-muted-foreground">Create and manage learning content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>Add a new lesson to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Title</Label>
                <Input
                  id="lesson-title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="Introduction to XSS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-content">Content (Markdown filename or content)</Label>
                <Textarea
                  id="lesson-content"
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  placeholder="lesson1.en.md or markdown content..."
                  rows={10}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLesson}>Create Lesson</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
          <CardDescription>Manage all learning content</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.id}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell className="max-w-md truncate">{lesson.content.substring(0, 50)}...</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditingLesson(lesson)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Lesson</DialogTitle>
                            <DialogDescription>Update lesson content</DialogDescription>
                          </DialogHeader>
                          {editingLesson && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={editingLesson.title}
                                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-content">Content</Label>
                                <Textarea
                                  id="edit-content"
                                  value={editingLesson.content}
                                  onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                  rows={10}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingLesson(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateLesson}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
