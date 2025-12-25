'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowLeft, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

const COLORS = ['#2563EB', '#6366F1', '#8B5CF6', '#A855F7', '#C026D3', '#DB2777']

export default function AnalyticsPage() {
  const params = useParams()
  const formId = params.formId as string

  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/analytics`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [formId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const exportCSV = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `responses-${formId}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export CSV:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="mt-6 p-12 text-center">
            <p className="text-muted-foreground">Failed to load analytics data</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/dashboard/${formId}/responses`}>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Responses
              </Button>
            </Link>
            <Button onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.overview.totalResponses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg">
                {analytics.overview.lastResponse
                  ? formatDateTime(analytics.overview.lastResponse)
                  : 'No responses yet'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.overview.totalResponses > 0 ? '100%' : '0%'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Analytics */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {analytics.questions
              .filter((q: any) => q.data.length > 0)
              .map((question: any) => (
                <Card key={question.questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{question.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {question.totalAnswers} responses
                      {question.average !== undefined && (
                        <span className="ml-2">• Average: {question.average.toFixed(1)}</span>
                      )}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={question.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2563EB" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pie Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={question.data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.label}: ${entry.count}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {question.data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Data Table */}
                    <div className="mt-6">
                      <table className="w-full text-sm">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left py-2">Option</th>
                            <th className="text-right py-2">Responses</th>
                            <th className="text-right py-2">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {question.data.map((item: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{item.label}</td>
                              <td className="text-right">{item.count}</td>
                              <td className="text-right">{item.percentage.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {analytics.questions.filter((q: any) => q.data.length > 0).length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No data to display yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Question Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.questions.map((question: any) => (
                    <div key={question.questionId} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium mb-1">{question.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        Type: {question.type} • Responses: {question.totalAnswers}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
