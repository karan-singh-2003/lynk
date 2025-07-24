'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'
import { useWorkspace } from '@/lib/context/workspace-context'
import CustomDialog from '@/components/Global/CustomModal'
import { updateWorkspace } from '@/actions/workspace'
import { useRouter } from 'next/navigation'

const Workspace = () => {
  const router = useRouter()
  const { workspace, setWorkspace } = useWorkspace()
  const [displayRemoveWorkspaceDialog, setdisplayRemoveWorkspaceDialog] =
    useState(false)
  const [, setIsLoading] = useState(true)
  const [tempName, setTempName] = useState<string>('') // always initialize with empty string
  const [tempSlug, setTempSlug] = useState<string>('')

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingSlug, setIsEditingSlug] = useState(false)

  useEffect(() => {
    if (workspace) {
      setTempName(workspace.name ?? '')
      setTempSlug(workspace.slug ?? '')
      setIsLoading(false)
    }
  }, [workspace])

  const handleCopy = async () => {
    if (workspace?.id) {
      await navigator.clipboard.writeText(workspace.id)
    }
  }

  const handleNameBlur = async () => {
    setIsEditingName(false)
    if (!workspace || tempName === workspace.name) return

    const updated = await updateWorkspace(workspace.id, { name: tempName })
    setWorkspace(updated)
  }

  const handleSlugBlur = async () => {
    setIsEditingSlug(false)
    if (!workspace || tempSlug === workspace.slug) return

    const updated = await updateWorkspace(workspace.id, { slug: tempSlug })
    setWorkspace(updated)

    // 👇 Navigate to new slug route
    router.push(`/${updated.slug}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          style={{ fontFamily: 'var(--font-poppins)' }}
          className="lg:text-2xl text-xl font-semibold text-[#0e0e0e] dark:text-white"
        >
          Workspace Details
        </h1>
        <p className="lg:text-sm text-sm text-muted-foreground font-medium mt-0.5">
          Manage your workspace information
        </p>
      </div>

      {/* Workspace Name */}
      <div>
        <h1 className="font-semibold text-sm">Workspace Name</h1>
        <p className="text-[13px] lg:text-[14px] my-1 mb-2 font-medium text-muted-foreground">
          This is the name of your workspace on Dub.
        </p>
        <Input
          className={`rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] lg:text-[15px] border ${
            isEditingName
              ? 'border-black dark:border-white'
              : 'border-gray-300 dark:border-[#484848]'
          }`}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onFocus={() => setIsEditingName(true)}
          onBlur={handleNameBlur}
        />
      </div>

      {/* Workspace Slug */}
      <div>
        <h1 className="font-semibold text-sm">Workspace Slug</h1>
        <p className="text-[13px] lg:text-[14px] my-1 mb-2 font-medium text-muted-foreground">
          This is your workspace&apos;s unique slug on Dub.
        </p>
        <Input
          className={`rounded-none text-[14px] lg:text-[15px]  focus-visible:ring-0 focus-visible:ring-offset-0 border ${
            isEditingSlug
              ? 'border-black dark:border-white'
              : 'border-gray-300 dark:border-[#484848]'
          }`}
          value={tempSlug}
          onChange={(e) => setTempSlug(e.target.value)}
          onFocus={() => setIsEditingSlug(true)}
          onBlur={handleSlugBlur}
        />
      </div>

      {/* Workspace ID */}
      <div>
        <h1 className="font-semibold text-sm">Workspace ID</h1>
        <p className="text-[13px] lg:text-[14px] my-1 mb-2 font-medium text-muted-foreground">
          This is a unique system ID for your workspace. You can copy it but not
          edit.
        </p>
        <div className="flex items-center gap-2">
          <Input
            className="rounded-none text-[14px] lg:text-[15px] dark:border-[#444444] border-gray-300 text-muted-foreground"
            value={workspace?.id ?? ''}
            readOnly
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gray-300 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Data deletion */}
      <div>
        <h1 className="font-semibold text-[15px]">Data deletion</h1>
        <div className="flex gap-x-8">
          <h1 className="text-[13px] lg:text-[14px] my-1 mb-2 font-medium text-muted-foreground">
            If you would like to permanently delete this workspace and all of
            the data in it, click on &quot;Delete workspace&quot;
          </h1>
          <Button
            className="bg-[#dc3e42] rounded-full text-xs text-white hover:bg-[#dc3e42]/90 mt-2"
            onClick={() => setdisplayRemoveWorkspaceDialog(true)}
          >
            Delete Workspace
          </Button>
        </div>
      </div>
      {displayRemoveWorkspaceDialog && (
        <CustomDialog
          title={`Are you sure you want to delete this workspace ?`}
          isOpen={displayRemoveWorkspaceDialog}
          onClose={() => setdisplayRemoveWorkspaceDialog(false)}
          className="w-[700px] h-auto"
        >
          <p className="text-sm text-muted-foreground mt-4">
            This will permanently delete all the data in this workspace.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="rounded-full border-none"
              onClick={() => setdisplayRemoveWorkspaceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive rounded-full px-4 text-white hover:bg-destructive/90"
              onClick={() => {
                // 🔥 Remove logic here
                console.log('Workspace deleted!')
                setdisplayRemoveWorkspaceDialog(false)
              }}
            >
              Delete
            </Button>
          </div>
        </CustomDialog>
      )}
    </div>
  )
}

export default Workspace
