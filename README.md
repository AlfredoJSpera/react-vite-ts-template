# react-vite-ts-template

This repository is a **template project** for quickly bootstrapping a React application using **TypeScript**, **Vite**, and **SWC**.

## Features

-   **Vite 7 + SWC** for fast builds and hot module replacement
-   **React 19** with **TypeScript** typings
-   Built-in **theme management** (persisted custom user-defined themes) and a fix for the [flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) issue
-   Ready-to-package as a **Firefox extension (.xpi)**

## TODO

-   [x] Set up Vite
-   [x] Local Storage State manager
-   [x] Theme manager
-   [x] Flash of Unstyled Content fix
-   [x] Firefox-ready
-   [x] Remove custom theme
-   [ ] Settings JSON downloader/importer

## Getting Started

### 1. Clone the template

```bash
git clone https://github.com/AlfredoJSpera/react-vite-ts-template.git my-app
cd my-app
```

> [!TIP]
> Or click the "Use this template" button on the repository page on GitHub.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

This will launch Vite in development mode with hot reloading.

## Build

### Standard build

```bash
npm run build
```

Compiles the app into the `dist/` folder.

### Build & package as Firefox extension

```bash
npm run build:xpi
```

-   Runs the production build
-   Zips the contents of `dist/` into `extension.xpi`

> [!NOTE]
> The `public/manifest.json` can be edited as needed to create the extension.

## Using as a Firefox Extension

### As a temporary extension

1. Download the packaged `extension.xpi`
2. Open Firefox and navigate to:

    ```
    about:debugging#/runtime/this-firefox
    ```

3. Click **"Load Temporary Add-on"**
4. Select `extension.xpi`

### As a fully installed extension

> [!WARNING]
> Currently WIP.

## Dependencies

-   [React 19](https://react.dev/)
-   [Vite 7](https://vitejs.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [SWC](https://swc.rs/) (via `@vitejs/plugin-react-swc`)

## How to add a theme

-   Add the theme as CSS variables in `src/theme/predefined-themes.css`
-   Add the name of the new theme in the PREDEFINED_THEME_NAMES array in `src/theme/theme.ts`

## How to use the Theme Manager Hook

The `useTheme` hook should be called only once in the app, preferably in a component to switch the theme.
See `src/components/ThemeSwitcher.tsx` or `src/components/ThemeSwitcherWithoutCustom.tsx` for an example of usage.

You can:

-   Switch to another theme
-   Save/Edit/Delete custom themes (**optional**)

> [!NOTE]
> If you don't want or need custom theming, you should:
>
> -   Be sure to clear the localStorage for the webapp
> -   Delete the `src/hooks/useTheme.ts` hook
> -   Delete the `src/components/ThemeSwitcher.tsx` component
> -   Use (and rename if necessary) the `src/hooks/useThemeWithoutCustom.ts` hook
> -   Use (and rename if necessary) the `src/components/ThemeSwitcherWithoutCustom.tsx` component
> -   Delete all lines marked from `//! Custom Theme Only` to `//! ---------------------` in `public/theme-loader.js`

## How the Flash of Unstyled Content fix works

```mermaid
flowchart TD
    A[Visit Website] --> B[theme-loader.js runs in index.html before React]
	B --> C{localStorage has theme?}
	C -- No --> D[Fallback: predefined-themes.css :root theme]
    C -- Yes --> E[Set data-theme attribute and eventual custom styles on the html tag]
	D --> F[DOM is Styled before React is mounted]
	E --> F
```

## License

This template is provided as-is under the [MIT license](LICENSE). Feel free to fork and customize it for your projects.
