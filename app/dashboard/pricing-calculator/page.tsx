"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Calculator, TrendingUp, DollarSign, Target, FileCode, Plus, Copy, Download } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Competitor {
  name: string
  price: number
  model: string
}

interface PricingTier {
  name: string
  price: string
  features: string
}

const pricingModels = [
  {
    id: 1,
    name: "Freemium",
    description: "Free basic version, paid premium features",
    pros: "Low barrier to entry, large user base, viral growth",
    cons: "Low conversion rates (2-5%), support costs for free users",
    bestFor: "Network effects, viral products, high volume markets",
    conversionRate: "2-5%",
    score: 7
  },
  {
    id: 2,
    name: "Flat Rate",
    description: "Single price for all features",
    pros: "Simple to understand, easy to sell, predictable revenue",
    cons: "Leaves money on table, limits growth, one-size-fits-all",
    bestFor: "Simple products, small teams, early-stage startups",
    conversionRate: "8-12%",
    score: 6
  },
  {
    id: 3,
    name: "Tiered Pricing",
    description: "Multiple packages at different price points",
    pros: "Captures different segments, upsell opportunities, maximizes revenue",
    cons: "Analysis paralysis, feature comparison complexity",
    bestFor: "Diverse customer base, scalable products, B2B SaaS",
    conversionRate: "10-15%",
    score: 9
  },
  {
    id: 4,
    name: "Per-User Pricing",
    description: "Price scales with number of users/seats",
    pros: "Revenue grows with customer, easy to calculate, predictable",
    cons: "Encourages account sharing, limits adoption in teams",
    bestFor: "Team collaboration tools, enterprise software",
    conversionRate: "12-18%",
    score: 8
  },
  {
    id: 5,
    name: "Usage-Based",
    description: "Pay for what you use (API calls, storage, etc.)",
    pros: "Fair pricing, scales naturally, attracts experimentation",
    cons: "Unpredictable revenue, billing complexity, price anxiety",
    bestFor: "Infrastructure, APIs, developer tools, cloud services",
    conversionRate: "15-25%",
    score: 7
  },
  {
    id: 6,
    name: "Value-Based",
    description: "Price based on customer value/ROI delivered",
    pros: "Maximizes revenue, aligns with customer success, premium positioning",
    cons: "Hard to calculate, requires customer education, long sales cycle",
    bestFor: "High-value B2B, consulting, enterprise solutions",
    conversionRate: "20-30%",
    score: 8
  }
]

export default function PricingCalculatorPage() {
  const { toast } = useToast()

  // Competitor Analysis State
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "Competitor A", price: 29, model: "Monthly" },
    { name: "Competitor B", price: 49, model: "Monthly" },
    { name: "Competitor C", price: 99, model: "Monthly" }
  ])
  const [newCompetitor, setNewCompetitor] = useState({ name: "", price: "", model: "Monthly" })

  // Van Westendorp State (Price Sensitivity Meter)
  const [tooExpensive, setTooExpensive] = useState([150])
  const [tooExpensiveToConsider, setTooExpensiveToConsider] = useState([200])
  const [tooCheap, setTooCheap] = useState([10])
  const [bargain, setBargain] = useState([30])

  // Value-Based Pricing State
  const [problemDescription, setProblemDescription] = useState("")
  const [timeSavedPerMonth, setTimeSavedPerMonth] = useState("")
  const [hourlyValue, setHourlyValue] = useState("")
  const [numberOfUsers, setNumberOfUsers] = useState("")

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { name: "Starter", price: "$29", features: "5 projects\n10GB storage\nEmail support" },
    { name: "Pro", price: "$79", features: "Unlimited projects\n100GB storage\nPriority support\nAdvanced analytics" },
    { name: "Enterprise", price: "$199", features: "Everything in Pro\nCustom integrations\nDedicated support\nSSO & advanced security" }
  ])

  // Add competitor
  const addCompetitor = () => {
    if (!newCompetitor.name || !newCompetitor.price) {
      toast({
        title: "Missing Information",
        description: "Please enter competitor name and price",
        variant: "destructive"
      })
      return
    }

    if (competitors.length >= 10) {
      toast({
        title: "Limit Reached",
        description: "Maximum 10 competitors allowed",
        variant: "destructive"
      })
      return
    }

    setCompetitors([...competitors, {
      name: newCompetitor.name,
      price: parseFloat(newCompetitor.price),
      model: newCompetitor.model
    }])
    setNewCompetitor({ name: "", price: "", model: "Monthly" })
    toast({
      title: "Competitor Added",
      description: `${newCompetitor.name} has been added to the analysis`
    })
  }

  // Remove competitor
  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index))
    toast({
      title: "Competitor Removed",
      description: "Competitor has been removed from the analysis"
    })
  }

  // Calculate competitor statistics
  const calculateStats = () => {
    if (competitors.length === 0) return { avg: 0, median: 0, min: 0, max: 0 }

    const prices = competitors.map(c => c.price).sort((a, b) => a - b)
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const median = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)]
    const min = prices[0]
    const max = prices[prices.length - 1]

    return { avg, median, min, max }
  }

  const stats = calculateStats()

  // Prepare chart data for competitor analysis
  const chartData = competitors.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 12) + "..." : c.name,
    price: c.price
  }))

  // Van Westendorp Analysis calculations
  const calculateOptimalPrice = () => {
    const tooExp = tooExpensive[0]
    const tooExpConsider = tooExpensiveToConsider[0]
    const cheap = tooCheap[0]
    const barg = bargain[0]

    // Optimal Price Point (OPP) - intersection of "too expensive" and "too cheap"
    const optimalPrice = (tooExp + cheap) / 2

    // Indifference Price Point (IPP) - intersection of "bargain" and "too expensive to consider"
    const indifferencePrice = (barg + tooExpConsider) / 2

    // Acceptable price range
    const minAcceptable = Math.max(cheap, barg * 0.8)
    const maxAcceptable = Math.min(tooExp, tooExpConsider * 0.8)

    return { optimalPrice, indifferencePrice, minAcceptable, maxAcceptable }
  }

  const priceAnalysis = calculateOptimalPrice()

  // Generate Van Westendorp chart data
  const generateVWData = () => {
    const data = []
    for (let price = 0; price <= 250; price += 10) {
      data.push({
        price,
        tooCheap: price < tooCheap[0] ? 100 : Math.max(0, 100 - (price - tooCheap[0]) * 2),
        bargain: price < bargain[0] ? 0 : Math.min(100, (price - bargain[0]) * 2),
        tooExpensive: price > tooExpensive[0] ? 100 : Math.max(0, (price / tooExpensive[0]) * 100),
        tooExpensiveToConsider: price > tooExpensiveToConsider[0] ? 100 : Math.max(0, (price / tooExpensiveToConsider[0]) * 100)
      })
    }
    return data
  }

  const vwChartData = generateVWData()

  // Value-Based Pricing calculations
  const calculateValuePrice = () => {
    const hours = parseFloat(timeSavedPerMonth) || 0
    const hourly = parseFloat(hourlyValue) || 0
    const users = parseInt(numberOfUsers) || 1

    const monthlyValue = hours * hourly * users
    const annualValue = monthlyValue * 12

    // Capture 10-30% of value created
    const lowPrice = monthlyValue * 0.1
    const midPrice = monthlyValue * 0.2
    const highPrice = monthlyValue * 0.3

    return {
      monthlyValue,
      annualValue,
      suggestedMonthly: midPrice,
      rangeMin: lowPrice,
      rangeMax: highPrice
    }
  }

  const valuePrice = calculateValuePrice()

  // Copy pricing tier code
  const generatePricingCode = () => {
    const code = `<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
${pricingTiers.map((tier, index) => `  <div className="border rounded-lg p-6 ${index === 1 ? 'border-blue-500 shadow-lg' : ''}">
    <h3 className="text-2xl font-bold mb-2">${tier.name}</h3>
    <div className="text-4xl font-bold mb-4">${tier.price}<span className="text-lg text-muted-foreground">/mo</span></div>
    <ul className="space-y-2 mb-6">
${tier.features.split('\n').map(f => `      <li>✓ ${f}</li>`).join('\n')}
    </ul>
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
      Get Started
    </button>
  </div>`).join('\n')}
</div>`
    return code
  }

  const copyPricingCode = () => {
    const code = generatePricingCode()
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied!",
      description: "Pricing page HTML copied to clipboard"
    })
  }

  const downloadPricingCode = () => {
    const code = generatePricingCode()
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pricing-section.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Download Started",
      description: "Pricing code has been downloaded"
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Calculator className="h-10 w-10 text-green-600" />
        <div>
          <h1 className="text-4xl font-bold">Pricing Strategy Calculator</h1>
          <p className="text-muted-foreground">
            Find the optimal pricing for your SaaS
          </p>
        </div>
      </div>

      <Tabs defaultValue="competitors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="competitors">
            <TrendingUp className="h-4 w-4 mr-2" />
            Competitor Analysis
          </TabsTrigger>
          <TabsTrigger value="vanwestendorp">
            <Target className="h-4 w-4 mr-2" />
            Van Westendorp
          </TabsTrigger>
          <TabsTrigger value="valuebased">
            <DollarSign className="h-4 w-4 mr-2" />
            Value-Based
          </TabsTrigger>
          <TabsTrigger value="models">
            <Calculator className="h-4 w-4 mr-2" />
            Model Comparison
          </TabsTrigger>
          <TabsTrigger value="generator">
            <FileCode className="h-4 w-4 mr-2" />
            Page Generator
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Competitor Analysis */}
        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Competitors</CardTitle>
              <CardDescription>
                Analyze competitor pricing to find your market position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="comp-name">Competitor Name</Label>
                  <Input
                    id="comp-name"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                    placeholder="e.g., Notion, Airtable"
                  />
                </div>
                <div>
                  <Label htmlFor="comp-price">Monthly Price ($)</Label>
                  <Input
                    id="comp-price"
                    type="number"
                    value={newCompetitor.price}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, price: e.target.value })}
                    placeholder="49"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCompetitor} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {competitors.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Competitor Pricing Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competitor</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitors.map((comp, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{comp.name}</TableCell>
                          <TableCell>${comp.price}/mo</TableCell>
                          <TableCell>
                            <Badge variant="outline">{comp.model}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCompetitor(index)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${stats.avg.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Median Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${stats.median.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">${stats.min.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Highest Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">${stats.max.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Price Distribution</CardTitle>
                  <CardDescription>Visual comparison of competitor pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="price" fill="#10b981" name="Monthly Price ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">Pricing Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Budget Tier:</strong> Price at ${(stats.min * 0.9).toFixed(2)} - ${stats.min.toFixed(2)} to undercut lowest competitor</p>
                  <p><strong>Mid-Market Tier:</strong> Price at ${(stats.avg * 0.9).toFixed(2)} - ${(stats.avg * 1.1).toFixed(2)} to match market average</p>
                  <p><strong>Premium Tier:</strong> Price at ${(stats.max * 1.1).toFixed(2)} - ${(stats.max * 1.3).toFixed(2)} if you offer superior features</p>
                  <p className="text-muted-foreground italic mt-4">Based on {competitors.length} competitor{competitors.length > 1 ? 's' : ''} analyzed</p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Tab 2: Van Westendorp Price Sensitivity Meter */}
        <TabsContent value="vanwestendorp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Sensitivity Analysis</CardTitle>
              <CardDescription>
                Set your price sensitivity thresholds to find the optimal price point
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Too Cheap (quality concerns): ${tooCheap[0]}</Label>
                  </div>
                  <Slider
                    value={tooCheap}
                    onValueChange={setTooCheap}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Below this price, customers doubt the quality</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Bargain (great value): ${bargain[0]}</Label>
                  </div>
                  <Slider
                    value={bargain}
                    onValueChange={setBargain}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">At this price, customers feel they&apos;re getting a great deal</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Getting Expensive: ${tooExpensive[0]}</Label>
                  </div>
                  <Slider
                    value={tooExpensive}
                    onValueChange={setTooExpensive}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Starting to feel expensive, but still worth considering</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Too Expensive: ${tooExpensiveToConsider[0]}</Label>
                  </div>
                  <Slider
                    value={tooExpensiveToConsider}
                    onValueChange={setTooExpensiveToConsider}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Too expensive to even consider purchasing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Sensitivity Curves</CardTitle>
              <CardDescription>Intersection points reveal optimal pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={vwChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="price" label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Respondents (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tooCheap" stroke="#ef4444" name="Too Cheap" strokeWidth={2} />
                  <Line type="monotone" dataKey="bargain" stroke="#10b981" name="Bargain" strokeWidth={2} />
                  <Line type="monotone" dataKey="tooExpensive" stroke="#f59e0b" name="Getting Expensive" strokeWidth={2} />
                  <Line type="monotone" dataKey="tooExpensiveToConsider" stroke="#dc2626" name="Too Expensive" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400">Optimal Price Point (OPP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">${priceAnalysis.optimalPrice.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">
                  The intersection of &ldquo;too expensive&rdquo; and &ldquo;too cheap&rdquo; - where customer resistance is minimized
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-400">Indifference Price Point (IPP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">${priceAnalysis.indifferencePrice.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">
                  The intersection of &ldquo;bargain&rdquo; and &ldquo;too expensive to consider&rdquo; - maximum acceptable price
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400">Acceptable Price Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Minimum Acceptable Price:</span>
                <span className="text-2xl font-bold">${priceAnalysis.minAcceptable.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maximum Acceptable Price:</span>
                <span className="text-2xl font-bold">${priceAnalysis.maxAcceptable.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500 rounded-full mt-4" />
              <p className="text-sm text-muted-foreground">
                Your pricing should fall within the ${priceAnalysis.minAcceptable.toFixed(0)} - ${priceAnalysis.maxAcceptable.toFixed(0)} range for maximum market acceptance
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Value-Based Pricing */}
        <TabsContent value="valuebased" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Value-Based Pricing Calculator</CardTitle>
              <CardDescription>
                Calculate pricing based on the value you deliver to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="problem">What problem does your product solve?</Label>
                <Input
                  id="problem"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g., Automates social media scheduling"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time-saved">Hours Saved Per Month</Label>
                  <Input
                    id="time-saved"
                    type="number"
                    value={timeSavedPerMonth}
                    onChange={(e) => setTimeSavedPerMonth(e.target.value)}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly-value">Hourly Value ($)</Label>
                  <Input
                    id="hourly-value"
                    type="number"
                    value={hourlyValue}
                    onChange={(e) => setHourlyValue(e.target.value)}
                    placeholder="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="num-users">Number of Users</Label>
                  <Input
                    id="num-users"
                    type="number"
                    value={numberOfUsers}
                    onChange={(e) => setNumberOfUsers(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {timeSavedPerMonth && hourlyValue && numberOfUsers && (
            <>
              <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-400">Value Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hours saved per month:</span>
                      <span className="font-mono">{timeSavedPerMonth} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">× Hourly value:</span>
                      <span className="font-mono">${hourlyValue}/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">× Number of users:</span>
                      <span className="font-mono">{numberOfUsers} {parseInt(numberOfUsers) === 1 ? 'user' : 'users'}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Monthly Value Created:</span>
                        <span className="text-2xl font-bold">${valuePrice.monthlyValue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-sm">Annual Value:</span>
                      <span className="font-mono">${valuePrice.annualValue.toFixed(2)}/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">Suggested Pricing</CardTitle>
                  <CardDescription>Capture 10-30% of the value you create</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4 border-b">
                    <div className="text-sm text-muted-foreground mb-2">Recommended Monthly Price (20% of value)</div>
                    <div className="text-5xl font-bold text-green-600">${valuePrice.suggestedMonthly.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground mt-2">per month</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Conservative (10%)</div>
                      <div className="text-2xl font-bold">${valuePrice.rangeMin.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Low barrier to entry</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Premium (30%)</div>
                      <div className="text-2xl font-bold">${valuePrice.rangeMax.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Maximum revenue</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3">Annual Pricing Options</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly × 12:</span>
                        <span className="font-mono">${(valuePrice.suggestedMonthly * 12).toFixed(2)}/year</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Annual (15% discount):</span>
                        <span className="font-mono font-semibold">${(valuePrice.suggestedMonthly * 12 * 0.85).toFixed(2)}/year</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Annual (20% discount):</span>
                        <span className="font-mono font-semibold">${(valuePrice.suggestedMonthly * 12 * 0.80).toFixed(2)}/year</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Formula:</strong> (Hours Saved × Hourly Value × Users) × Capture Rate</p>
                    <p><strong>Your ROI to customer:</strong> They save ${valuePrice.monthlyValue.toFixed(2)}/mo, pay ${valuePrice.suggestedMonthly.toFixed(2)}/mo = {((valuePrice.monthlyValue / valuePrice.suggestedMonthly - 1) * 100).toFixed(0)}% ROI</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Tab 4: Pricing Model Comparison */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compare Pricing Models</CardTitle>
              <CardDescription>
                Evaluate 6 different pricing strategies for your SaaS
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingModels.map((model) => (
              <Card key={model.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{model.name}</CardTitle>
                    <Badge variant={model.score >= 8 ? "default" : "outline"}>
                      Score: {model.score}/10
                    </Badge>
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-green-600 mb-2">Pros</h4>
                    <p className="text-sm text-muted-foreground">{model.pros}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-red-600 mb-2">Cons</h4>
                    <p className="text-sm text-muted-foreground">{model.cons}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Best For</h4>
                    <p className="text-sm text-muted-foreground">{model.bestFor}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg. Conversion:</span>
                      <Badge variant="outline">{model.conversionRate}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-400">Choosing Your Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Early Stage?</strong> Start with Flat Rate or Freemium for simplicity and growth</p>
              <p><strong>Diverse Customers?</strong> Use Tiered Pricing to capture different segments</p>
              <p><strong>Team Product?</strong> Per-User pricing scales naturally with team growth</p>
              <p><strong>API/Infrastructure?</strong> Usage-Based aligns costs with value delivered</p>
              <p><strong>Enterprise Focus?</strong> Value-Based maximizes revenue from large deals</p>
              <p className="text-muted-foreground italic pt-2">You can combine models: Freemium base + Tiered paid plans + Usage-Based add-ons</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Pricing Page Generator */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Page Generator</CardTitle>
              <CardDescription>
                Create your pricing tiers and get ready-to-use code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pricingTiers.map((tier, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Tier {index + 1}</h4>
                    {pricingTiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPricingTiers(pricingTiers.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Tier Name</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...pricingTiers]
                          updated[index].name = e.target.value
                          setPricingTiers(updated)
                        }}
                        placeholder="Starter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...pricingTiers]
                          updated[index].price = e.target.value
                          setPricingTiers(updated)
                        }}
                        placeholder="$29"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Features (one per line)</Label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={tier.features}
                      onChange={(e) => {
                        const updated = [...pricingTiers]
                        updated[index].features = e.target.value
                        setPricingTiers(updated)
                      }}
                      placeholder="5 projects&#10;10GB storage&#10;Email support"
                    />
                  </div>
                </div>
              ))}

              {pricingTiers.length < 4 && (
                <Button
                  onClick={() => setPricingTiers([...pricingTiers, { name: "", price: "", features: "" }])}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={copyPricingCode} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button onClick={downloadPricingCode} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <CardDescription>Preview your pricing page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
                {pricingTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-950 rounded-lg p-6 shadow-lg ${
                      index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''
                    }`}
                  >
                    {index === 1 && (
                      <Badge className="mb-2">Most Popular</Badge>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{tier.name || 'Tier Name'}</h3>
                    <div className="text-4xl font-bold mb-4">
                      {tier.price || '$0'}
                      <span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {tier.features.split('\n').filter(f => f.trim()).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
