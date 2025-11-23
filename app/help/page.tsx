import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HelpCircle, Mail, MessageSquare, BookOpen } from "lucide-react"

export const metadata = {
  title: "Help & Support",
  description: "Get help with SaaS Launch Toolkit - FAQs, tutorials, and support"
}

export default function HelpPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <HelpCircle className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-5xl font-bold">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions or get in touch with our team
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Documentation</CardTitle>
              <CardDescription>Step-by-step guides for each tool</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Docs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Video Tutorials</CardTitle>
              <CardDescription>Watch how to use each feature</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Watch Videos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Email Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Contact Us</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is SaaS Launch Toolkit?</AccordionTrigger>
                <AccordionContent>
                  SaaS Launch Toolkit is a comprehensive platform designed to help solo founders and indie hackers launch their SaaS products in 30 days. It includes 5 core tools: ProductHunt Optimizer, Pricing Calculator, 30-Day Launch Sequence, Customer Acquisition Playbook, and Marketing Asset Generator.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Do I need technical skills to use this?</AccordionTrigger>
                <AccordionContent>
                  No! All tools are designed to be user-friendly and require no technical knowledge. You simply fill in forms, and we generate the content, strategies, and plans you need.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can try SaaS Launch Toolkit for free with limited access to all tools. Upgrade to Pro for unlimited access and advanced features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How does the ProductHunt Optimizer work?</AccordionTrigger>
                <AccordionContent>
                  The ProductHunt Optimizer helps you prepare for a successful ProductHunt launch. It generates taglines, descriptions, first comments, and provides a complete launch checklist. It&apos;s based on strategies from products that reached #1 Product of the Day.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I export the generated content?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! All generated content can be copied to your clipboard with one click. Some tools also support exporting to CSV or PDF format.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>What pricing plans do you offer?</AccordionTrigger>
                <AccordionContent>
                  We offer a Free plan with basic access, and a Pro plan at $29/month with unlimited access to all tools, priority support, and early access to new features. Check our pricing page for full details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes! We use industry-standard encryption and security practices. Your data is stored securely in Supabase with row-level security. We never share your data with third parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. No questions asked. You&apos;ll retain access until the end of your billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                <AccordionContent>
                  Yes! We offer a 30-day money-back guarantee. If you&apos;re not satisfied for any reason, contact us within 30 days for a full refund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Simply sign up for a free account, and you&apos;ll get immediate access to all tools. Start with the ProductHunt Optimizer or the 30-Day Launch Sequence to plan your launch.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger>What if I need custom features?</AccordionTrigger>
                <AccordionContent>
                  We&apos;re constantly adding new features based on user feedback. If you need something specific, contact us and we&apos;ll consider it for our roadmap.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger>Do you provide launch coaching?</AccordionTrigger>
                <AccordionContent>
                  Not currently, but we&apos;re considering adding 1-on-1 launch coaching for Pro users. Join our waitlist if you&apos;re interested!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>Send us a message and we&apos;ll get back to you within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your question..."
                  rows={6}
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        {/* Video Tutorials Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
            <CardDescription>Watch step-by-step guides for each tool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Video: ProductHunt Optimizer</span>
                </div>
                <h3 className="font-semibold">How to optimize your ProductHunt launch</h3>
                <p className="text-sm text-muted-foreground">5:32</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Video: Pricing Calculator</span>
                </div>
                <h3 className="font-semibold">Finding the perfect price for your SaaS</h3>
                <p className="text-sm text-muted-foreground">7:15</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Video: Launch Sequence</span>
                </div>
                <h3 className="font-semibold">Creating your 30-day launch plan</h3>
                <p className="text-sm text-muted-foreground">6:48</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground">Video: Customer Acquisition</span>
                </div>
                <h3 className="font-semibold">Getting your first 100 customers</h3>
                <p className="text-sm text-muted-foreground">8:22</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
