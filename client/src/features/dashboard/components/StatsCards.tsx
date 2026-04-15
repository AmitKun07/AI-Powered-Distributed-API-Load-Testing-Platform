import { Card, CardContent } from "@/components/ui/card"

type Props = {
  title: string
  value: string
  subtitle?: string
}

export default function StatsCard({ title, value, subtitle }: Props) {
  return (
    <Card className="rounded-xl border border-gray-800 bg-[#18181b] shadow-none">
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">
          {title}
        </div>

        <div className="text-2xl font-semibold mt-2">
          {value}
        </div>

        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  )
}