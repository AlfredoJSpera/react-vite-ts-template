# react-vite-ts-template

A small template for a **React** + **Vite** + **TypeScript** app that can run as a normal web app or be packaged as a _browser extension_ (Firefox). It includes a _simple theme_ system (predefined + optional custom themes), an early theme loader to avoid [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content), and content script integration.

## Highlights

### Themes

-   Theme system with predefined themes
-   Custom themes defined at runtime (by the user, for example) saved in localStorage and applied as CSS variables
    -   Theme hook
    -   Theme Context helper
    -   Theme Provider
    -   [Example of a component using these](src/components/ThemeSwitcher.tsx)
-   "Without custom themes" alternate implementation (lighter, only predefined themes)
-   Early theme application before React mounts

### Firefox Extension

-   Content script:
    -   Message sender util for communication between content script and React app
    -   [Example of a component using it](src/components/DisplayH1InPage.tsx)
-   Vite config includes a content-script build entry
-   Extension manifest

## Quick start

-   **Install dependencies**:

    ```shell
    npm install
    ```

-   **Run in dev**:

    ```shell
    npm run dev
    ```

-   **Build**:

    ```shell
    npm run build
    ```

-   **Build XPI** (Firefox extension package):
    ```shell
    npm run build:xpi
    ```

## Theme provider usage

Wrap your `App` component with [`ThemeProvider`](src/theme/ThemeProvider.tsx). From any component, use the context hook [`useThemeContext`](src/hooks/useThemeContext.ts) to access:

-   currentTheme
-   applyNewCurrentTheme
-   custom theme functions (save/edit/delete) when using the full implementation

The project includes a [`ThemeSwitcher`](src/components/ThemeSwitcher.tsx) component to switch theme.

> [!NOTE]
> There are two implementations of the theme manager:
>
> -   **Full implementation**: both predefined and user-defined themes
> -   **Only predefined themes**

## Content script usage

Register a message listener in [contentScript.ts](src/contentScript.ts) and send messages to it using [`sendContentScriptMessage`](src/utils/sendContentScriptMessage.ts).

The project includes a content script that reads the first H1 on the page and it is used by the [`DisplayH1InPage`](src/components/DisplayH1InPage.tsx) component.

> [!NOTE]
> The content script can only run when the app is installed as an extension or when the content script is injected into a page. See [manifest.json](public/manifest.json).

## Initial configuration script

The [choose_project_configuration.sh](choose_project_configuration.sh) helper script automates one-time workspace configurations:

-   Option 1: keep both predefined and user-defined themes (removes the `WithoutCustomThemes` directories)
-   Option 2: use ONLY predefined themes (it replaces files from `WithoutCustomThemes` into the main locations)
-   Option 3: remove Firefox extension files (removes content-script, helper utilities and manifest, and updates imports)

> [!WARNING]
> The script deletes/moves files from fixed locations. Execute this script before applying changes.

## Load as a temporary Firefox extension

1. Build the project to create the `/dist` directory
2. Open Firefox and navigate to:

    ```
    about:debugging#/runtime/this-firefox
    ```

3. Click **"Load Temporary Add-on"**
4. Select any file in the `/dist` directory, for example `manifest.json` or the `.xpi` file

## License

This template is provided as-is under the [MIT license](LICENSE). Feel free to fork it and customize it for your projects.
