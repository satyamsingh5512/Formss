'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Palette, Upload, X, Image as ImageIcon, Sliders } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [headerColor, setHeaderColor] = useState(settings.headerColor || '#000000')
  const [allowMultiple, setAllowMultiple] = useState(settings.allowMultiple || false)
  const [showProgress, setShowProgress] = useState(settings.showProgress ?? true)
  const [shuffleQuestions, setShuffleQuestions] = useState(settings.shuffleQuestions || false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-bold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border-2 border-black dark:border-white/20 rounded-2xl shadow-neo-lg z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b-2 border-black dark:border-white/20 bg-zinc-50 dark:bg-zinc-900">
                <div>
                  <h2 className="text-xl font-black text-black dark:text-white">Form Settings</h2>
                  <p className="text-sm text-zinc-500 font-medium">Customize appearance and behavior</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 rounded-lg">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <Tabs defaultValue="branding" className="w-full">
                  <TabsList className="w-full bg-zinc-100 dark:bg-white/5 p-1 rounded-xl mb-6 border-2 border-black/5 dark:border-white/5">
                    <TabsTrigger value="branding" className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-2 data-[state=active]:border-black/10 dark:data-[state=active]:border-white/10">
                      <Palette className="h-4 w-4 mr-2" />
                      Branding
                    </TabsTrigger>
                    <TabsTrigger value="options" className="flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-2 data-[state=active]:border-black/10 dark:data-[state=active]:border-white/10">
                      <Sliders className="h-4 w-4 mr-2" />
                      Options
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="branding" className="space-y-6 focus-visible:outline-none">
                    {/* Logo Upload */}
                    <div className="space-y-3">
                      <Label className="text-black dark:text-white font-bold">Organization Logo</Label>
                      <div className="space-y-3">
                        {logoPreview ? (
                          <div className="relative w-40 h-40 border-2 border-dashed border-black/20 dark:border-white/20 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-white/5 overflow-hidden group">
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="max-w-full max-h-full object-contain p-2"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={removeLogo}
                                className="h-9 font-bold"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-black/20 dark:border-white/20 rounded-xl cursor-pointer bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <div className="p-3 rounded-full bg-white dark:bg-white/10 mb-3 text-zinc-400 border-2 border-black/5">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                              <p className="text-sm text-zinc-500 font-medium">
                                <span className="font-bold text-black dark:text-white">Click to upload</span> or drag and drop
                              </p>
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
                    </div>

                    {/* Organization Name */}
                    <div className="space-y-2">
                      <Label className="text-black dark:text-white font-bold">Organization Name</Label>
                      <Input
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Acme Corporation"
                        className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-zinc-400 focus-visible:border-black dark:focus-visible:border-white rounded-lg"
                      />
                    </div>

                    {/* Header Color */}
                    <div className="space-y-2">
                      <Label className="text-black dark:text-white font-bold">Header Color</Label>
                      <div className="flex gap-3">
                        <div className="relative">
                          <Input
                            type="color"
                            value={headerColor}
                            onChange={(e) => setHeaderColor(e.target.value)}
                            className="w-12 h-10 p-1 cursor-pointer bg-transparent border-2 border-black/10 dark:border-white/10 rounded-lg"
                          />
                        </div>
                        <Input
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-zinc-400 focus-visible:border-black dark:focus-visible:border-white rounded-lg uppercase"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="options" className="space-y-4 focus-visible:outline-none">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border-2 border-black/10 dark:border-white/10">
                      <div className="space-y-0.5">
                        <Label className="text-black dark:text-white font-bold">Allow Multiple Responses</Label>
                        <p className="text-xs text-zinc-500 font-medium">
                          Users can submit the form multiple times
                        </p>
                      </div>
                      <Switch
                        checked={allowMultiple}
                        onCheckedChange={setAllowMultiple}
                        className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border-2 border-black/10 dark:border-white/10">
                      <div className="space-y-0.5">
                        <Label className="text-black dark:text-white font-bold">Show Progress Bar</Label>
                        <p className="text-xs text-zinc-500 font-medium">
                          Display completion progress at the top
                        </p>
                      </div>
                      <Switch
                        checked={showProgress}
                        onCheckedChange={setShowProgress}
                        className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border-2 border-black/10 dark:border-white/10">
                      <div className="space-y-0.5">
                        <Label className="text-black dark:text-white font-bold">Shuffle Questions</Label>
                        <p className="text-xs text-zinc-500 font-medium">
                          Randomize question order for each respondent
                        </p>
                      </div>
                      <Switch
                        checked={shuffleQuestions}
                        onCheckedChange={setShuffleQuestions}
                        className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex gap-3 p-6 pt-4 bg-zinc-50 dark:bg-black/20 border-t-2 border-black dark:border-white/20">
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 font-bold rounded-lg">
                  Cancel
                </Button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
