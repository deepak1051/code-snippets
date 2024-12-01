import * as React from "react"
import { cn } from "../../lib/utils"

const Code = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  )
})
Code.displayName = "Code"

const Pre = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <pre
      ref={ref}
      className={cn(
        "mb-4 mt-2 overflow-x-auto rounded-lg border bg-muted p-4 dark:bg-muted",
        className
      )}
      {...props}
    />
  )
})
Pre.displayName = "Pre"

export { Code, Pre }
