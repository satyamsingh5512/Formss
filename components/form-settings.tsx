'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Palette, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FormSettingsProps {
  formId: string
  settings: {
    logoUrl?: string
    organizationName?: string
    headerColor?: string
    allowMultiple?: boolean
    showProgress?: boolean
    shuffleQuestions?: boolean
  }
  onUpdate: (settings: any) => void
}

export function FormSettings({ formId, settings, onUpdate }: FormSettingsProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(settings.logoUrl || '')
  const [organizationName, setOrganizationName] = useState(settings.organizationName || '')
  const [headerColor, setHeaderColor] = useState(settings.headerColor || '#2563EB')
  const [allowMultiple, setAllowMultiple] = useState(settings.allowMultiple || false)
  const [showProgress, setShowProgress] = useState(settings.showProgress ?? true)
  const [shuffleQuestions, setShuffleQuestions] = useState(settings.shuffleQuestions || false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Logo must be less than 5MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)

    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setLogoPreview(base64String)
        toast({
          title: 'Logo uploaded',
          description: 'Your logo has been uploaded successfully',
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload logo',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const updatedSettings = {
      logoUrl: logoPreview,
      organizationName,
      headerColor,
      allowMultiple,
      showProgress,
      shuffleQuestions,
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) throw new Error('Failed to update settings')

      onUpdate(updatedSettings)
      setIsOpen(false)
      toast({
        title: 'Settings saved',
        description: 'Your form settings have been updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      })
    }
  }

  const removeLogo = () => {
    setLogoPreview('')
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Settings className="h-4 w-4 mr-2" />
        Form Settings
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Settings</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Customize your form appearance and behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="branding">
                <Palette className="h-4 w-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="options">
                <Settings className="h-4 w-4 mr-2" />
                Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6 pt-4">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Organization Logo</Label>
                <div className="space-y-3">
                  {logoPreview ? (
                    <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain p-2"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your logo will appear at the top of the form
                </p>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Corporation"
                />
                <p className="text-xs text-muted-foreground">
                  Display name shown with your logo
                </p>
              </div>

              {/* Header Color */}
              <div className="space-y-2">
                <Label htmlFor="header-color">Header Color</Label>
                <div className="flex gap-3">
                  <Input
                    id="header-color"
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    placeholder="#2563EB"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Custom color for the form header
                </p>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-6 pt-4">
              {/* Allow Multiple Responses */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Multiple Responses</Label>
                  <p className="text-xs text-muted-foreground">
                    Users can submit the form multiple times
                  </p>
                </div>
                <Switch
                  checked={allowMultiple}
                  onCheckedChange={setAllowMultiple}
                />
              </div>

              {/* Show Progress Bar */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Progress Bar</Label>
                  <p className="text-xs text-muted-foreground">
                    Display completion progress at the top
                  </p>
                </div>
                <Switch
                  checked={showProgress}
                  onCheckedChange={setShowProgress}
                />
              </div>

              {/* Shuffle Questions */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Shuffle Questions</Label>
                  <p className="text-xs text-muted-foreground">
                    Randomize question order for each respondent
                  </p>
                </div>
                <Switch
                  checked={shuffleQuestions}
                  onCheckedChange={setShuffleQuestions}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
