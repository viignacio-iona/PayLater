import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning"
  size?: "default" | "sm" | "lg" | "icon" | "xs"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    isLoading = false, 
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden group"
    
    const variants = {
      default: "bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-lg hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
      destructive: "bg-gradient-to-r from-error-500 via-error-600 to-error-700 text-white shadow-lg hover:from-error-600 hover:via-error-700 hover:to-error-800 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
      outline: "border-2 border-neutral-200 bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
      secondary: "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 border border-neutral-200 shadow-md hover:from-neutral-200 hover:to-neutral-300 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
      ghost: "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 hover:scale-105 transition-all duration-200",
      link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 hover:scale-105 transition-all duration-200",
      success: "bg-gradient-to-r from-success-500 via-success-600 to-success-700 text-white shadow-lg hover:from-success-600 hover:via-success-700 hover:to-success-800 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
      warning: "bg-gradient-to-r from-warning-500 via-warning-600 to-warning-700 text-white shadow-lg hover:from-warning-600 hover:via-warning-700 hover:to-warning-800 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
    }
    
    const sizes = {
      xs: "h-8 px-3 text-xs min-h-[32px]",
      sm: "h-10 px-4 text-sm min-h-[40px]",
      default: "h-12 px-6 text-base min-h-[48px]",
      lg: "h-14 px-8 text-lg min-h-[56px]",
      icon: "h-10 w-10 min-h-[40px] min-w-[40px]"
    }
    
    const isDisabled = disabled || isLoading
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isDisabled && "hover:scale-100 hover:shadow-lg hover:-translate-y-0",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {!isDisabled && !isLoading && (
          <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        
        {/* Content */}
        <span className={cn("relative z-10 flex items-center", isLoading && "opacity-0")}>
          {leftIcon && !isLoading && (
            <span className="mr-2 transition-transform duration-200 group-hover:scale-110">{leftIcon}</span>
          )}
          
          {children}
          
          {rightIcon && !isLoading && (
            <span className="ml-2 transition-transform duration-200 group-hover:scale-110">{rightIcon}</span>
          )}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
