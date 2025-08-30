#!/bin/bash

# Exit immediately if there are any errors
set -e

#MARK: Colors
RED="\033[31m"
YELLOW="\033[33m"
MAGENTA="\033[35m"
CYAN="\033[36m"
GREEN="\033[32m"
RESET="\033[0m"


#MARK: Search for specific files

has_without_custom=false
if find ./public ./src -type d -name 'WithoutCustomThemes' -print -quit | grep -q .; then
	has_without_custom=true
fi

has_manifest=false
if [ -f "./public/manifest.json" ]; then
	has_manifest=true
fi

has_content_script=false
if [ -f "./src/contentScript.ts" ]; then
	has_content_script=true
fi

#MARK: Display choices

display_choices() {
	local choice_number=$1
	local choice_prompt=$2
	local is_not_disabled=$3
	local disabled_notice=$4

	if $is_not_disabled; then
		echo "    ${choice_number}) ${choice_prompt}"
	else
		echo "    ${choice_number}) ${choice_prompt} (disabled because ${disabled_notice})"
	fi
}

echo "Theme configuration:"
choice_one_and_two_disabled_notice="'WithoutCustomThemes' was not found"
display_choices 1 "Use both predefined and user-defined themes" $has_without_custom "${choice_one_and_two_disabled_notice}"
display_choices 2 "Use ONLY predefined themes" $has_without_custom "${choice_one_and_two_disabled_notice}"
echo 

echo "Firefox extension configurations:"
choice_three_disabled_notice="'public/manifest.json' was not found"
display_choices 3 "Remove ALL firefox extension files" $has_manifest "${choice_three_disabled_notice}"
choice_four_disabled_notice="'src/contentScript.json' was not found"
display_choices 4 "Remove content script files" $has_content_script "${choice_four_disabled_notice}"
echo

#MARK: Common operation functions

check_if_disabled_choice_is_selected() {
	local choice_number=$1
	local is_not_disabled=$2
	local disabled_notice=$3

	if ! $is_not_disabled; then
		echo "${RED}Option ${choice_number} is disabled because ${disabled_notice}.${RESET} Exiting..."
		exit 1
	fi
}

display_warning() {
	local operation_description=$1
	echo "==========================================="
	echo "${operation_description}"
	echo -e "${RED}WARNING: This action is intended to be run only once, immediately after cloning the repository.${RESET}"
	echo -e "${RED}If you have made changes to any of the listed files, do NOT run this.${RESET}"
}

ask_for_confirmation() {
	local operation_description=$1
	read -p "Are you sure you want to ${operation_description}? (y/N): " confirm
	if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
		echo "Operation aborted."
		exit 1
	fi
}

delete_file() {
	local file_to_delete=$1

	if [ -f "${file_to_delete}" ]; then
		echo -e "${YELLOW}[Deleting file] ${file_to_delete}${RESET}"
		rm "${file_to_delete}"
	fi
}

delete_directory() {
	local directory_to_delete=$1
	echo -e "${MAGENTA}[Deleting directory] ${directory_to_delete}${RESET}"
	rm -rf "${directory_to_delete}"
}

remove_npm_package() {
	local package_to_remove=$1
	echo -e "${CYAN}[Removing npm package] ${package_to_remove}${RESET}"
	npm remove "${package_to_remove}"
}

update_file_log() {
	local file_to_update=$1
	local is_import_update=$2
	if $is_import_update; then
		echo -e "${GREEN}[Updating imports] ${file_to_update}${RESET}"
	else
		echo -e "${GREEN}[Updating file] ${file_to_update}${RESET}"
	fi
}

#MARK: Case Switch

read -p "Enter choice (1/2/3/4): " choice
case "$choice" in
	1)
		check_if_disabled_choice_is_selected 1 $has_without_custom "${choice_one_and_two_disabled_notice}"
		display_warning "Removing functionality to use only predefined themes..."
		ask_for_confirmation "remove the functionality to use only predefined themes"

		delete_without_custom_themes_directory() {
			local directory_to_delete=$1
			echo -e "\033[32m[Deleting directory] ${directory_to_delete}/WithoutCustomThemes\033[0m"
			rm -rf "${directory_to_delete}/WithoutCustomThemes"
		}

		delete_without_custom_themes_directory ./public
		delete_without_custom_themes_directory ./src/components
		delete_without_custom_themes_directory ./src/hooks
		delete_without_custom_themes_directory ./src/theme
		
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

		delete_file ./src/components/DisplayH1InPage.tsx
		delete_file ./src/utils/sendContentScriptMessage.ts
		delete_file ./src/types/contentScriptTypes.ts
		delete_file ./src/contentScript.ts
		delete_file ./public/manifest.json

		echo -e "\033[34m[Removing npm package] @types/firefox-webext-browser\033[0m"
		npm remove @types/firefox-webext-browser

		echo -e "\033[33m[Updating file] ./src/App.tsx\033[0m"
		sed -i '/DisplayH1InPage/d' ./src/App.tsx


		if [ -f vite.config.ts ]; then
			echo -e "\033[33m[Updating file] ./vite.config.ts\033[0m"
			sed -i '/\/\/! Browser Content Script Only/,/\/\/! ---------------------/d' vite.config.ts
		fi
		;;

	4)
		if ! $has_content_script; then
			echo "Option 4 is disabled because 'src/contentScript.ts' was not found. Exiting."
			exit 1
		fi

		echo -e "==========================================="
		echo -e "Removing content script functionality..."
		display_warning

		read -p "Are you sure you want to remove firefox extension content script functionality? (y/N): " confirm
		if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
			echo "Operation aborted."
			exit 1
		fi

		delete_file ./src/components/DisplayH1InPage.tsx
		delete_file ./src/utils/sendContentScriptMessage.ts
		delete_file ./src/types/ContentScript.ts
		delete_file ./src/contentScript.ts

		echo -e "\033[33m[Updating file] ./src/App.tsx\033[0m"
		sed -i '/DisplayH1InPage/d' ./src/App.tsx

		if [ -f ./public/manifest.json ]; then
			echo -e "\033[33m[Updating file] ./public/manifest.json\033[0m"
			echo -e "\033[31m[Updating file] ./public/manifest.json, WARNING: I will have to delete specific line numbers. Check if the JSON is not malformed after this.\033[0m"
			sed -i '25,30d' ./public/manifest.json
			sed -i 's/"permissions": \[\],/"permissions": \[\]/' ./public/manifest.json
		fi

		if [ -f vite.config.ts ]; then
			echo -e "\033[33m[Updating file] ./vite.config.ts\033[0m"
			sed -i '/\/\/! Browser Content Script Only/,/\/\/! ---------------------/d' vite.config.ts
		fi
		;;
	*)
		echo "Invalid choice. Exiting."
		exit 1
		;;
esac

echo -e "Done! Remember to delete this script!"
exit 0