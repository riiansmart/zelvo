# Styling and Theming Guide

## Introduction
This document provides a comprehensive guide to the styling conventions, theming strategy, and operational best practices adopted within the TaskFlow frontend application. A clear understanding and consistent application of these guidelines are essential for maintaining a cohesive user interface and a manageable, scalable styling architecture.

## 1. Core Styling Engine: Tailwind CSS

TaskFlow leverages Tailwind CSS as its primary engine for styling. This utility-first framework enables rapid UI development by composing atomic utility classes directly within the markup.

### 1.1. Configuration Analysis (`tailwind.config.cjs`)
The behavior and customization of Tailwind are centralized in `tailwind.config.cjs`. Below is a summary of the key configurations currently employed:

| Configuration Key       | Setting                                               | Description                                                                                                                               |
| :---------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `content`               | `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]` | Specifies the files Tailwind scans to identify used utility classes, ensuring unused styles are purged from the production build.         |
| `darkMode`              | `'class'`                                             | Enables dark mode support, triggered by the presence of a `.dark` class on an ancestor element (typically `<html>` or `<body>`).             |
| `theme.extend.colors` | (See details below)                                   | Extends the default Tailwind color palette with custom semantic color names, mapped to CSS variables for dynamic theming.               |
| `plugins`               | `[]`                                                  | Currently, no additional third-party Tailwind plugins are registered.                                                                       |

**Theme Color Extensions:**
The following custom color names are defined and mapped to CSS variables, facilitating the application-wide theme:

-   `primary`: `var(--accent-primary)`
-   `secondary`: `var(--accent-secondary)`
-   `background`: `var(--bg-primary)`
-   `background-secondary`: `var(--bg-secondary)`
-   `text`: `var(--text-primary)`
-   `text-secondary`: `var(--text-secondary)`

These can be used like standard Tailwind colors (e.g., `bg-primary`, `text-secondary`). The actual color values are defined via the CSS variables, likely within `cyberpunk.css` or potentially injected via JavaScript by the `ThemeContext`.

### 1.2. CSS Processing (`postcss.config.cjs`)
PostCSS is employed to process the CSS codebase. The configuration in `postcss.config.cjs` specifies the plugins used during this process:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

-   **`tailwindcss`**: Processes Tailwind directives (like `@tailwind`, `@apply`, `theme()`) and generates the corresponding utility classes based on the configuration.
-   **`autoprefixer`**: Automatically adds vendor prefixes to CSS rules, ensuring cross-browser compatibility based on standard browser support definitions.

### 1.3. Usage Philosophy
The fundamental approach is to **prioritize the direct application of Tailwind utility classes within JSX**. This practice keeps styles co-located with the component structure, enhancing readability and maintainability. While tools like `@apply` exist, they should be used sparingly, primarily for abstracting highly repetitive combinations where a dedicated component isn't justified. The goal is to leverage the expressiveness of utilities directly for most styling requirements.

## 2. Custom Theming Strategy (`cyberpunk.css`)

Beyond Tailwind's utilities, a distinct visual identity is established through a custom theme, primarily defined in `src/styles/cyberpunk.css`. This file serves several critical functions.

### 2.1. Theme Purpose and Structure
The `cyberpunk.css` file provides the foundational aesthetic for TaskFlow. It likely contains:
-   **Base Style Overrides:** Customizations to default HTML element styles (e.g., body background, font settings, link appearance) that align with the cyberpunk theme, potentially overriding or supplementing Tailwind's `preflight` base styles.
-   **CSS Variable Definitions:** Definition of the core theme variables (like `--accent-primary`, `--bg-primary`, referenced in `tailwind.config.cjs`) that control the application's color palette, typography, and potentially other stylistic elements.
-   **Custom Component Styles:** Styles for specific, complex components or patterns that are difficult or verbose to achieve purely with utility classes. These might target custom class names applied to components.
-   **Third-Party Overrides:** Custom styles needed to integrate third-party library components seamlessly into the application's theme.

### 2.2. Integration with Tailwind Ecosystem
Effective integration between the custom theme and Tailwind is crucial. This is typically achieved using Tailwind's `@layer` directive within `cyberpunk.css` (or potentially `index.css` where it's imported). Custom styles should be injected into the appropriate layers:

-   `@layer base { ... }`: For base style overrides and CSS variable definitions.
-   `@layer components { ... }`: For custom component classes.
-   `@layer utilities { ... }`: For custom utility classes (though generally less common when extending via CSS).

This layering ensures that custom styles respect Tailwind's precedence rules and can be overridden by utility classes as expected.

### 2.3. Theme Variables and Dynamic Theming
The use of CSS variables (e.g., `var(--accent-primary)`) is central to the theming strategy, particularly because `darkMode` is set to `'class'`. This setup allows for dynamic theme switching (e.g., light/dark mode) by changing the values of these variables based on the presence of the `.dark` class on a parent element. The `ThemeContext` likely handles the logic for toggling this class and potentially swapping the variable values applied to the root element.

**Key CSS Variables (Inferred from Tailwind Config):**

| Variable Name             | Consumed By Tailwind As | Purpose                                    |
| :------------------------ | :-------------------- | :----------------------------------------- |
| `--accent-primary`        | `primary`             | Primary accent color (buttons, highlights) |
| `--accent-secondary`      | `secondary`           | Secondary accent color                     |
| `--bg-primary`            | `background`          | Primary content background color           |
| `--bg-secondary`          | `background-secondary`| Secondary background (cards, sidebars)     |
| `--text-primary`          | `text`                | Primary text color                         |
| `--text-secondary`        | `text-secondary`      | Secondary text color (muted text, labels)  |

## 3. Styling Best Practices and Conventions

To ensure consistency and maintainability, the following styling practices should be observed:

| Practice                 | Recommendation                                                                                                                                                           |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Utility Prioritization** | Always prefer applying Tailwind utility classes directly in JSX markup over creating custom CSS classes.                                                                     |
| **`@apply` Usage**       | Use `@apply` sparingly. It's acceptable for very small, highly reused combinations, but extracting a styled component is often a better alternative for complexity.         |
| **Component Abstraction**| For elements with complex or frequently repeated styling, create dedicated, well-named React components that encapsulate the necessary Tailwind classes and structure.        |
| **Conditional Styling**  | Utilize libraries like `clsx` or template literals with helper functions to manage the application of conditional classes cleanly, avoiding messy inline ternary operators. |
| **Global Styles Scope**  | Reserve `src/styles/index.css` for essential global setups (like font imports) or critical third-party overrides that cannot be handled within `cyberpunk.css` or components. |
| **Responsive Design**    | Adopt a mobile-first approach. Define base styles for mobile viewports and use Tailwind's breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) to adapt styles for larger screens. |

## 4. Styling Third-Party Libraries

Integrating third-party components requires careful style management. The general approach involves:
1.  **Importing Base Styles:** Include the library's default CSS (as seen with the date/time picker imports in `main.tsx`).
2.  **Targeted Overrides:** If necessary, write specific CSS rules in `cyberpunk.css` (within an appropriate `@layer`) or potentially `index.css` to override the library's default styles, aligning them with the TaskFlow theme. Use specific selectors, potentially leveraging browser developer tools to identify the necessary targets, but avoid overly broad overrides. 