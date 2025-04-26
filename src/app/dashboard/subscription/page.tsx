
import PricingSection from "@/components/Pricing"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"



export default function SubscriptionPage() {
  const premiumUsage = 12
  const premiumLimit = 50
  const freeUsage = 28
  const freeLimit = 200

  return (
    <div className="space-y-8 bg-background text-foreground md:pt-6">
      <div>
        <h1 className="text-4xl font-bold">Your Subscription</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          You can manage your account, billing, and team settings here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Name</p>
                <p className="text-muted-foreground">Yugandhar developer</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-muted-foreground">yugandhardeveloper@gmail.com</p>
              </div>
            </div>
            <Avatar>
              <AvatarFallback className="rounded-lg">{'DM'}</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Premium Usage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Premium models</span>
                <span>{premiumUsage} / {premiumLimit}</span>
              </div>
              <Progress value={(premiumUsage / premiumLimit) * 100} />
              <p className="text-sm text-muted-foreground mt-2">
                You&apos;ve used no requests out of your <strong>{premiumLimit}</strong> fast requests quota.
              </p>
            </div>

            {/* Free Usage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>gpt-4o-mini or cursor-small</span>
                <span>{freeUsage} / {freeLimit}</span>
              </div>
              <Progress value={(freeUsage / freeLimit) * 100} />
              <p className="text-sm text-muted-foreground mt-2">
                You&apos;ve used no requests out of your <strong>{freeLimit}</strong> monthly fast requests quota.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Button variant="secondary" className="cursor-pointer">Upgrade to Pro</Button>
            <Button className="cursor-pointer">Upgrade to Business</Button>
            <div className="text-muted-foreground mt-2 text-sm cursor-pointer">
              Advanced <span className="text-xs">▼</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-8">Upgrade your plan</h2>
        <PricingSection />
      </div>
    </div>
  )
}
