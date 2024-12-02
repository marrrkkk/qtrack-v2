import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ClassCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassCardSkeleton

