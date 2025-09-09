import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  text?: string
  subtext?: string
  className?: string
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  color?: "primary" | "secondary" | "success" | "warning" | "error"
}

export function Loading({ 
  size = "md", 
  text, 
  subtext,
  className, 
  variant = "spinner",
  color = "primary"
}: LoadingProps) {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6", 
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const containerSizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  }

  const textSizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl", 
    xl: "text-2xl"
  }

  const colorClasses = {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    error: "text-error-600"
  }

  const bgColorClasses = {
    primary: "bg-primary-100",
    secondary: "bg-secondary-100", 
    success: "bg-success-100",
    warning: "bg-warning-100",
    error: "bg-error-100"
  }

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full animate-bounce",
                  sizeClasses[size],
                  bgColorClasses[color]
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case "pulse":
        return (
          <div className={cn(
            "rounded-full animate-pulse",
            containerSizeClasses[size],
            bgColorClasses[color]
          )}>
            <div className={cn(
              "rounded-full animate-ping",
              sizeClasses[size],
              bgColorClasses[color]
            )} />
          </div>
        )
      
      case "skeleton":
        return (
          <div className="space-y-2">
            <div className={cn("skeleton h-4 w-32")} />
            <div className={cn("skeleton h-3 w-24")} />
            <div className={cn("skeleton h-3 w-20")} />
          </div>
        )
      
      default:
        return (
          <div className={cn(
            "rounded-full flex items-center justify-center",
            containerSizeClasses[size],
            bgColorClasses[color]
          )}>
            <Loader2 className={cn(
              "animate-spin",
              sizeClasses[size],
              colorClasses[color]
            )} />
          </div>
        )
    }
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        {renderSpinner()}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {renderSpinner()}
      
      {text && (
        <div className="text-center space-y-2">
          <h3 className={cn(
            "font-semibold text-neutral-900",
            textSizeClasses[size]
          )}>
            {text}
          </h3>
          {subtext && (
            <p className="text-neutral-600 text-sm">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  color = "primary"
}: Omit<LoadingProps, "text" | "subtext" | "variant">) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  }

  const colorClasses = {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    success: "text-success-600", 
    warning: "text-warning-600",
    error: "text-error-600"
  }

  return (
    <Loader2 className={cn(
      "animate-spin",
      sizeClasses[size],
      colorClasses[color],
      className
    )} />
  )
}

export function LoadingDots({ 
  size = "md",
  className,
  color = "primary"
}: Omit<LoadingProps, "text" | "subtext" | "variant">) {
  const sizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5", 
    xl: "w-3 h-3"
  }

  const colorClasses = {
    primary: "bg-primary-600",
    secondary: "bg-secondary-600",
    success: "bg-success-600",
    warning: "bg-warning-600", 
    error: "bg-error-600"
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-bounce",
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

export function LoadingSkeleton({ 
  lines = 3,
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton h-4",
            i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full"
          )}
        />
      ))}
    </div>
  )
}
