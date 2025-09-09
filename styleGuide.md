🎨 Enhanced Style Guide — Project Codename: PayLater

## 1. Brand Identity
- **Tone**: Friendly, trustworthy, lighthearted — money conversations should feel easy, not stressful.
- **Voice**: Clear, casual, supportive ("You're all settled!", "@mika owes you ₱320")
- **Personality**: Modern, approachable, reliable, with a touch of playfulness

⸻

## 2. Enhanced Color System

### Primary Palette (WCAG AA compliant):
- **Primary**: `#6366f1` (Indigo-600) → Main actions, CTAs
- **Primary Light**: `#818cf8` (Indigo-400) → Hover states, secondary accents  
- **Primary Dark**: `#4f46e5` (Indigo-700) → Active states, pressed buttons

### Secondary Palette:
- **Secondary**: `#0ea5e9` (Sky-500) → Supporting actions, links
- **Secondary Light**: `#38bdf8` (Sky-400) → Subtle highlights
- **Secondary Dark**: `#0284c7` (Sky-600) → Hover states

### Status Colors:
- **Success**: `#10b981` (Emerald-500) → Positive states, confirmations
- **Warning**: `#f59e0b` (Amber-500) → Caution, pending states
- **Error**: `#ef4444` (Red-500) → Errors, destructive actions
- **Accent**: `#facc15` (Yellow-400) → Highlights, balances

### Neutral Palette:
- **Background**: `#f9fafb` (Neutral-50)
- **Surface**: `#ffffff` (White) with 80-90% opacity for glassmorphism
- **Borders**: `#e5e7eb` (Neutral-200)
- **Text Primary**: `#111827` (Neutral-900)
- **Text Secondary**: `#6b7280` (Neutral-500)
- **Text Muted**: `#9ca3af` (Neutral-400)

### Accessibility:
- All colors maintain 4.5:1 contrast ratio minimum (WCAG AA)
- Enhanced focus states with 2px ring and offset
- Color-blind friendly palette with sufficient contrast

⸻

## 3. Enhanced Typography

### Font Stack:
- **Primary**: Inter (Google Fonts) - weights 300, 400, 500, 600, 700, 800
- **Fallback**: system-ui, sans-serif
- **Features**: OpenType features enabled (rlig, calt)

### Type Scale:
- **H1**: 3rem (48px) / 3.5rem (56px) - Hero headings
- **H2**: 2.25rem (36px) / 2.5rem (40px) - Section headings  
- **H3**: 1.875rem (30px) / 2rem (32px) - Subsection headings
- **H4**: 1.5rem (24px) / 1.75rem (28px) - Card titles
- **H5**: 1.25rem (20px) / 1.5rem (24px) - Small headings
- **H6**: 1.125rem (18px) / 1.25rem (20px) - Labels
- **Body**: 1rem (16px) / 1.125rem (18px) - Default text
- **Small**: 0.875rem (14px) / 1rem (16px) - Secondary text
- **Caption**: 0.75rem (12px) / 0.875rem (14px) - Helper text

### Typography Rules:
- **Headings**: Font-weight 600-700, tracking-tight
- **Body**: Font-weight 400, line-height 1.6
- **Emphasis**: Use color & weight, avoid italics
- **Numbers**: Tabular lining for currency alignment
- **Selection**: Primary color background with high contrast text

⸻

## 4. Enhanced Layout & Components

### Spacing System:
- **Base Unit**: 8px (0.5rem)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- **Custom**: 18px (4.5rem), 88px (22rem), 128px (32rem)

### Border Radius:
- **Small**: 8px (rounded-lg) - Small elements
- **Medium**: 12px (rounded-xl) - Buttons, inputs
- **Large**: 16px (rounded-2xl) - Cards, modals
- **Extra Large**: 24px (rounded-3xl) - Hero sections
- **Custom**: 32px (rounded-4xl), 40px (rounded-5xl)

### Shadow System:
- **Soft**: Subtle elevation for cards
- **Medium**: Moderate elevation for modals
- **Large**: Strong elevation for overlays
- **Glow**: Special effects for interactive elements

### Enhanced Buttons:
- **Primary**: Gradient background, white text, rounded-2xl, 48px height
- **Secondary**: Outline style, neutral colors, rounded-2xl, 48px height
- **Success**: Green gradient for positive actions
- **Warning**: Amber gradient for caution actions
- **Destructive**: Red gradient for destructive actions
- **Ghost**: Transparent background, text-only
- **Link**: Underlined text style

### Enhanced Inputs:
- **Default**: Glassmorphism background, rounded-xl, 48px height
- **Filled**: Solid background, subtle borders
- **Outlined**: Transparent background, thick borders
- **States**: Focus, error, success with appropriate colors and icons
- **Sizes**: Small (40px), Default (48px), Large (56px)

### Enhanced Dropdown Fields (Select):
- **Container**: `relative` wrapper div for positioning
- **Select Element**: `appearance-none` to remove browser default styling
- **Padding**: `px-3 sm:px-4 pr-10` (extra right padding for chevron)
- **Height**: `h-12` (48px) for consistency with other inputs
- **Border**: `border border-gray-300` with focus states
- **Background**: `bg-white` for proper contrast
- **Chevron Icon**: Custom `ChevronDown` from Lucide React, positioned absolutely
- **Chevron Position**: `absolute right-3 top-1/2 transform -translate-y-1/2`
- **Chevron Styling**: `h-4 w-4 text-gray-400 pointer-events-none`

⸻

## 5. Enhanced UX Patterns

### Navigation:
- **Mobile**: Bottom tab bar (Dashboard / Trips / Add / Profile)
- **Desktop**: Top navigation bar + sidebar for trips
- **Responsive**: Adaptive layout based on screen size

### State Management:
- **Empty States**: Friendly illustrations with clear CTAs ("No trips yet — start one!")
- **Loading States**: Skeleton screens for better perceived performance
- **Error States**: Empathetic messaging with recovery options
- **Success States**: Clear confirmation with next steps

### Feedback System:
- **Success**: Green colors for confirmations, settlements
- **Warning**: Amber colors for pending states, cautions
- **Error**: Red colors for errors, amounts owed
- **Info**: Blue colors for informational messages

### Accessibility:
- **Focus Management**: Clear focus indicators with 2px ring
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)

⸻

## 6. Enhanced Branding Elements

### Logo & Identity:
- **Logo**: Simplified "tab" icon with overlapping receipts or group icon + currency symbol
- **Favicon**: Minimal tab icon in Primary color (#6366f1)
- **Brand Colors**: Consistent use of primary palette across all touchpoints

### Illustration Style:
- **Style**: Flat, geometric, 2D illustrations (inspired by Splitwise/Airbnb)
- **Colors**: Muted versions of brand colors for illustrations
- **Consistency**: Same illustration style across all empty states and onboarding

### Visual Hierarchy:
- **Primary Actions**: Bold, gradient buttons with strong contrast
- **Secondary Actions**: Outline or ghost buttons
- **Content**: Clear typography hierarchy with proper spacing

⸻

## 7. Enhanced Motion & Interactions

### Animation Principles:
- **Purpose**: Every animation should serve a functional purpose
- **Duration**: 150-300ms for micro-interactions, 300-500ms for page transitions
- **Easing**: Cubic-bezier(0.4, 0, 0.2, 1) for natural motion
- **Performance**: GPU-accelerated transforms (transform, opacity)

### Micro-animations:
- **Buttons**: Scale 0.95 → 1 on press, subtle hover lift
- **Cards**: Hover lift with shadow increase
- **Inputs**: Focus ring animation, error/success state transitions
- **Loading**: Smooth skeleton animations, not jarring spinners

### Page Transitions:
- **Mobile**: Slide-in transitions between screens
- **Desktop**: Fade transitions with subtle scale effects
- **Modals**: Scale-in with backdrop blur
- **Navigation**: Smooth tab switching with content fade

### Special Effects:
- **OCR Processing**: Pulsing "analyzing" state with progress indication
- **Success Actions**: Subtle bounce or glow effects
- **Error States**: Gentle shake animation for form validation
- **Loading States**: Skeleton screens with shimmer effects

⸻

## 8. Component Usage Examples

### Dashboard Cards:
- **Style**: Rounded-3xl corners, soft shadows, glassmorphism background
- **Content**: Clear hierarchy with trip name, dates, and member count
- **Status**: Color-coded indicators for amounts owed/owing (yellow/green)
- **Interaction**: Hover lift effect with shadow increase

### Trip Screens:
- **Layout**: Tabbed interface for Summary/Expenses
- **Spacing**: Consistent 8px grid system throughout
- **Mobile**: Floating + Add Expense CTA button
- **Desktop**: Sidebar navigation with main content area

### OCR Review Interface:
- **Layout**: Table-like structure with aligned input fields
- **Confidence**: Visual indicators for field accuracy
- **Editing**: Inline editing with clear save/cancel actions
- **Preview**: Side-by-side receipt and parsed data comparison

⸻

## 9. Advanced UX Patterns

### OCR Processing Flow:
- **Confidence Indicators**: 
  - Green (90%+) - High confidence, minimal review needed
  - Yellow (70-89%) - Medium confidence, review recommended
  - Red (<70%) - Low confidence, manual review required
- **Edit Mode**: Inline editing with clear save/cancel actions
- **Receipt Preview**: Side-by-side comparison for easy verification
- **Split Templates**: Quick-select for common scenarios

### Split Templates:
- **Equal Split**: Default option, no additional input required
- **By Nights**: Number input for nights per person
- **By Meals**: Number input for meals per person  
- **Custom Split**: Detailed editor for complex scenarios

### Mobile Enhancements:
- **Haptic Feedback**: Light tap for button presses and confirmations
- **Push Notifications**: Gentle reminders for invites and settlements
- **Image Capture**: Overlay guides for optimal receipt positioning
- **Quick Actions**: Swipe gestures for common actions (mark paid, delete)

### Real-time Features:
- **Live Indicators**: Subtle dots showing data sync status
- **Optimistic Updates**: Immediate UI updates with background sync
- **Connection Status**: Clear offline/reconnecting indicators

⸻

## 10. Enhanced Component Library

### Expense Cards:
- **Layout**: Receipt thumbnail (left), details (center), amount (right)
- **Status Indicators**: 
  - Pending OCR (yellow dot with pulse animation)
  - Confirmed (green checkmark)
  - Error (red X with retry option)
- **Split Summary**: "Split 3 ways" or "You owe ₱150"
- **Interaction**: Tap to expand details, swipe for quick actions

### Settlement Modal:
- **Payment Display**: QR code with payment link
- **Amount Breakdown**: Clear "You owe" vs "You're owed" sections
- **Actions**: "Mark as paid", "Send reminder", "View receipt"
- **Animation**: Scale-in with backdrop blur

### OCR Processing:
- **Progress Bar**: Multi-stage progress ("Uploading" → "Processing" → "Review")
- **Confidence Scores**: Visual indicators for each parsed field
- **Edit Suggestions**: Highlighted potential errors or low-confidence items
- **Loading States**: Skeleton screens during processing

### Enhanced Loading States:
- **Skeleton Screens**: Better perceived performance than spinners
- **Progressive Loading**: Load critical content first
- **Error Recovery**: Clear retry mechanisms with helpful messaging

⸻

## 11. Modal System (Standardized Layout)

### Standard Layout:
- **Container**: `max-h-[80vh] flex flex-col` (dynamic height, flex column)
- **Empty Header**: `<div className="h-4 sm:h-8 flex-shrink-0"></div>` (16px mobile, 32px desktop)
- **Scrollable Content**: `<div className="flex-1 overflow-y-auto modal-scroll px-4 sm:px-8 min-h-0">`
- **Empty Footer**: `<div className="h-4 sm:h-8 flex-shrink-0"></div>` (16px mobile, 32px desktop)

### Modal Structure Template:
```jsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-100 max-h-[80vh] flex flex-col">
    {/* Empty header space - 16px on mobile, 32px on desktop */}
    <div className="h-4 sm:h-8 flex-shrink-0"></div>
    
    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto modal-scroll px-4 sm:px-8 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-gray-200/50">
        {/* Modal header content */}
      </div>
      
      {/* Main content */}
      <div className="pt-4 sm:pt-6">
        {/* Modal body content */}
      </div>
    </div>

    {/* Empty footer space - 16px on mobile, 32px on desktop */}
    <div className="h-4 sm:h-8 flex-shrink-0"></div>
  </div>
</div>
```

### Modal Guidelines:
- **Container**: Always use `max-h-[80vh] flex flex-col` for dynamic height
- **Modal Box**: `bg-white/90 backdrop-blur-xl` with rounded corners and shadow
- **Empty Spaces**: Required for proper scroll behavior and visual balance
- **Content Area**: `flex-1 overflow-y-auto` with proper padding
- **Padding**: `px-4 sm:px-8` for content, `pt-4 sm:pt-6` for form content
- **Close Button**: Circular border, consistent sizing across all modals
- **Icons**: Use appropriate Lucide React icons with consistent sizing

### Modal Color Coding:
- **Trip Management**: Green gradient (`from-green-100 to-emerald-100`)
- **Expense Management**: Green gradient (`from-green-100 to-emerald-100`)
- **User Management**: Green gradient (`from-green-100 to-emerald-100`)
- **User Profile**: Indigo gradient (`from-indigo-100 to-purple-100`)
- **QR Code Viewer**: Indigo gradient (`from-indigo-100 to-purple-100`)

### Modal Types & Sizes:
- **Standard**: `max-w-sm sm:max-w-md` (Create Trip, Add Expense, Manage Users)
- **Wide**: `max-w-md sm:max-w-lg` (User Profile with QR code)
- **Full**: `max-w-lg sm:max-w-xl` (Large content modals)

### Quick Reference for Developers:
```jsx
// Copy-paste template for new modals
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-100 max-h-[80vh] flex flex-col">
    <div className="h-4 sm:h-8 flex-shrink-0"></div>
    <div className="flex-1 overflow-y-auto modal-scroll px-4 sm:px-8 min-h-0">
      {/* Your modal content here */}
    </div>
    <div className="h-4 sm:h-8 flex-shrink-0"></div>
  </div>
</div>

// Copy-paste template for dropdown fields
<div>
  <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700 mb-2">
    Field Label *
  </label>
  <div className="relative">
    <select
      id="fieldName"
      value={fieldValue}
      onChange={(e) => handleChange("fieldName", e.target.value)}
      className="w-full h-12 px-3 sm:px-4 pr-10 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white appearance-none"
      required
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
  </div>
</div>
```

⸻

## 12. Implementation Guidelines

### CSS Architecture:
- **Tailwind CSS**: Utility-first approach with custom design tokens
- **Component Classes**: Reusable component styles in @layer components
- **Custom Properties**: CSS variables for dynamic theming
- **Responsive Design**: Mobile-first approach with breakpoint-specific styles

### Performance:
- **Animation**: GPU-accelerated transforms only
- **Images**: Optimized formats with lazy loading
- **Fonts**: Preloaded with font-display: swap
- **Bundle Size**: Tree-shaking and code splitting

### Accessibility:
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for complex interactions
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliance testing

### Browser Support:
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Fallbacks**: Graceful degradation for older browsers

⸻
