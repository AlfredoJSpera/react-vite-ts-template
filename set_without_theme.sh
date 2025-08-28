replaced_files=()

replace_files() {
	local file_location=$1
	local file_name=$2
	local file_to_replace="${file_location}/${file_name}"
	
	rm "${file_to_replace}"
	mv "${file_location}/WithoutCustomThemes/${file_name}" "${file_to_replace}"
	
	echo -e "\033[32m[Replaced] ${file_to_replace}\033[0m"

	replaced_files+=("${file_to_replace}")
	
	if [ -d "${file_location}/WithoutCustomThemes" ] && [ ! "$(ls -A "${file_location}/WithoutCustomThemes")" ]; then
		rmdir "${file_location}/WithoutCustomThemes"
		echo -e "\033[34m[Delete Directory] ${file_location}/WithoutCustomThemes\033[0m"
	fi
}

echo -e "\033[31mWARNING: THIS SCRIPT SHOULD BE EXECUTED ONLY ONCE, AND ONLY AFTER YOU CLONE THE REPOSITORY\033[0m"
echo -e "\033[31mIF YOU HAVE MADE CHANGES TO ANY FILES, DO NOT EXECUTE THE SCRIPT AND APPLY THE CHANGES MANUALLY\033[0m"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
	echo "Aborted."
	exit 1
fi

replace_files ./public theme-loader.js
replace_files ./src/components ThemeSwitcher.tsx
replace_files ./src/hooks useTheme.ts
replace_files ./src/hooks useThemeContext.ts
replace_files ./src/theme ThemeContext.ts
replace_files ./src/theme ThemeProvider.tsx


echo -e "\033[33mUpdating import paths in replaced files (removing '../' and '/WithoutCustomThemes'):\033[0m"
for file in "${replaced_files[@]}"; do
	# Regex for the imports:
	# `../../*;` --> `../*;`
	# `/WithoutCustomThemes/*;` --> `/*;`
	sed -i -E "s|\.\./\.\./([^;]*);|../\1;|g; s|/WithoutCustomThemes/([^;]*);|/\1;|g" "$file"
	echo -e "\t\033[33mUpdated imports in: $file\033[0m"
done

echo -e "Done! Remember to delete this script!"