#!/bin/bash

# Combined project configuration script
# Options:
# 1 - Use both predefined and user-defined themes (removes "WithoutCustomThemes" directories)
# 2 - Use ONLY predefined themes (replace files from WithoutCustomThemes into place)
# 3 - Remove firefox extension files

set -e

has_without_custom=false
if find ./public ./src -type d -name 'WithoutCustomThemes' -print -quit | grep -q .; then
	has_without_custom=true
fi

has_manifest=false
if [ -f "./public/manifest.json" ]; then
	has_manifest=true
fi

echo "Theme configuration:"
if $has_without_custom; then
	echo "    1) Use both predefined and user-defined themes"
	echo "    2) Use ONLY predefined themes"
else
	echo "    1) Use both predefined and user-defined themes (disabled because 'WithoutCustomThemes' was not found)"
	echo "    2) Use ONLY predefined themes (disabled because 'WithoutCustomThemes' was not found)"
fi

echo 
echo "Other configurations:"
if $has_manifest; then
	echo "    3) Remove firefox extension files"
else
	echo "    3) Remove firefox extension files (disabled because 'public/manifest.json' was not found)"
fi

echo
read -p "Enter choice (1/2/3): " choice

display_warning() {
	echo -e "\033[31mWARNING: This action is intended to be run only once, immediately after cloning the repository.\033[0m"
	echo -e "\033[31mIf you have made changes to any of the listed files, do NOT run this. \033[0m"
}

case "$choice" in
	1)
		if ! $has_without_custom; then
			echo "Option 1 is disabled because 'WithoutCustomThemes' was not found. Exiting."
			exit 1
		fi

		echo -e "==========================================="
		echo -e "Removing predefined theming only functionality..."
		display_warning

		read -p "Are you sure you want to remove the functionality to use only predefined themes? (y/N): " confirm
		if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
			echo "Operation aborted."
			exit 1
		fi

		delete_directory() {
			local directory_to_delete=$1
			echo -e "\033[32m[Deleting directory] ${directory_to_delete}/WithoutCustomThemes\033[0m"
			rm -rf "${directory_to_delete}/WithoutCustomThemes"
		}

		delete_directory ./public
		delete_directory ./src/components
		delete_directory ./src/hooks
		delete_directory ./src/theme

		echo -e "Done! Remember to delete this script!"
		exit 0
		;;

	2)
		if ! $has_without_custom; then
			echo "Option 2 is disabled because 'WithoutCustomThemes' was not found. Exiting."
			exit 1
		fi

		echo -e "==========================================="
		echo -e "Removing user-defined theming functionality..."
		display_warning

		read -p "Are you sure you want to replace files with their predefined themes only counterparts? (y/N): " confirm
		if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
			echo "Operation aborted."
			exit 1
		fi

		replace_files() {
			local file_location=$1
			local file_name=$2
			local file_to_replace="${file_location}/${file_name}"

			echo -e "\033[32m[Replacing file] ${file_to_replace}\033[0m"
			rm -f "${file_to_replace}"
			mv "${file_location}/WithoutCustomThemes/${file_name}" "${file_to_replace}"

			# Update imports in replaced files: remove extra ../ and /WithoutCustomThemes/ fragments
			# Regex used:
			# `../../*;` --> `../*;`
			# `/WithoutCustomThemes/*;` --> `/*;`
			echo -e "\033[33m[Updating imports] ${file_to_replace}\033[0m"
			sed -i -E "s|\.\./\.\./([^;]*);|../\1;|g; s|/WithoutCustomThemes/([^;]*);|/\1;|g" "${file_to_replace}"

			if [ -d "${file_location}/WithoutCustomThemes" ] && [ ! "$(ls -A "${file_location}/WithoutCustomThemes")" ]; then
				echo -e "\033[34m[Deleting directory] ${file_location}/WithoutCustomThemes\033[0m"
				rmdir "${file_location}/WithoutCustomThemes"
			fi
		}

		replace_files ./public theme-loader.js
		replace_files ./src/components ThemeSwitcher.tsx
		replace_files ./src/hooks useTheme.ts
		replace_files ./src/hooks useThemeContext.ts
		replace_files ./src/theme ThemeContext.ts
		replace_files ./src/theme ThemeProvider.tsx

		echo -e "Done! Remember to delete this script!"
		exit 0
		;;

	3)
		if ! $has_manifest; then
			echo "Option 3 is disabled because 'public/manifest.json' was not found. Exiting."
			exit 1
		fi

		echo -e "==========================================="
		echo -e "Removing firefox extension functionality..."
		display_warning

		read -p "Are you sure you want to remove firefox extension functionality? (y/N): " confirm
		if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
			echo "Operation aborted."
			exit 1
		fi

		delete_file() {
			local file_to_delete=$1
			echo -e "\033[32m[Deleting file] ${file_to_delete}\033[0m"
			rm -f "${file_to_delete}"
		}

		delete_file ./src/components/DisplayH1InPage.tsx
		delete_file ./src/utils/sendContentScriptMessage.ts
		delete_file ./src/types/contentScriptTypes.ts
		delete_file ./src/contentScript.ts
		delete_file ./public/manifest.json

		echo -e "\033[34m[Removing npm package] @types/firefox-webext-browser\033[0m"
		npm remove @types/firefox-webext-browser

		echo -e "\033[33m[Updating file] ./src/App.tsx\033[0m"
		sed -i '/DisplayH1InPage/d' ./src/App.tsx


		echo -e "\033[33m[Updating file] vite.config.ts\033[0m"
		if [ -f vite.config.ts ]; then
			sed -i '/\/\/! Browser Content Script Only/,/\/\/! ---------------------/d' vite.config.ts
		else
			echo "[ERROR] vite.config.ts not found."
		fi

		echo -e "Done! Remember to delete this script!"
		exit 0
		;;

	*)
		echo "Invalid choice. Exiting."
		exit 1
		;;
esac
