#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import readline from "readline/promises";
import { stdin, stdout } from "process";

//MARK: Colors

const RED = "\u001b[31m";
const YELLOW = "\u001b[33m";
const MAGENTA = "\u001b[35m";
const CYAN = "\u001b[36m";
const GREEN = "\u001b[32m";
const RESET = "\u001b[0m";

//MARK: Helpers

function fileExists(filePath: string) {
	return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

function directoryExists(directoryPath: string) {
	return (
		fs.existsSync(directoryPath) &&
		fs.lstatSync(directoryPath).isDirectory()
	);
}

function getDirectoryFileNumber(directoryPath: string) {
	if (directoryExists(directoryPath)) {
		return fs.readdirSync(directoryPath).length;
	} else {
		return -1;
	}
}

function directoryExistsInRoots(roots: string[], targetName: string): boolean {
	for (const root of roots) {
		if (!fs.existsSync(root)) continue;
		const found = searchDirectoryRecursive(root, targetName);
		if (found) return true;
	}
	return false;
}

function searchDirectoryRecursive(
	directoryPath: string,
	targetName: string
): boolean {
	try {
		const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
		for (const e of entries) {
			if (e.isDirectory() && e.name === targetName) return true;
			if (e.isDirectory()) {
				const sub = path.join(directoryPath, e.name);
				if (searchDirectoryRecursive(sub, targetName)) return true;
			}
		}
	} catch {
		// ignore
	}
	return false;
}

//MARK: Operation functions

function deleteFile(filePath: string) {
	if (fileExists(filePath)) {
		console.log(`${YELLOW}[Deleting file] ${filePath}${RESET}`);
		fs.unlinkSync(filePath);
	}
}

function deleteDirectory(dirPath: string) {
	if (directoryExists(dirPath)) {
		console.log(`${MAGENTA}[Deleting directory] ${dirPath}${RESET}`);
		fs.rmSync(dirPath, { recursive: true, force: true });
	}
}

function removeNpmPackage(pkg: string) {
	console.log(`${CYAN}[Removing npm package] ${pkg}${RESET}`);
	const res = spawnSync("npm", ["remove", pkg], { stdio: "inherit" });
	if (res.error) {
		console.error(`${RED}npm remove failed: ${res.error}${RESET}`);
	}
}

function updateFileLog(fileToUpdate: string) {
	console.log(`${GREEN}[Updating file] ${fileToUpdate}${RESET}`);
}

function moveFile(oldPath: string, newPath: string) {
	if (fileExists(oldPath)) {
		console.log(`${YELLOW}[Moving file] ${oldPath} -> ${newPath}${RESET}`);

		// Makes sure the destination directory exists
		fs.mkdirSync(path.dirname(oldPath), {
			recursive: true,
		});

		// Move the file
		fs.renameSync(oldPath, newPath);
	}
}

//MARK: Choices helpers

async function prompt(question: string) {
	const rl = readline.createInterface({ input: stdin, output: stdout });
	const answer = await rl.question(question);
	rl.close();
	return answer;
}

function checkIfDisabledChoiceIsSelected(
	choiceNumber: number,
	isNotDisabled: boolean,
	disabledNotice: string
) {
	if (!isNotDisabled) {
		console.error(
			`${RED}Option ${choiceNumber} is disabled because ${disabledNotice}.${RESET} Exiting...`
		);
		process.exit(1);
	}
}

function displayWarning(operationDescription: string) {
	console.log("===========================================");
	console.log(operationDescription);
	console.log(
		`${RED}WARNING: This action is intended to be run only once, immediately after cloning the repository.${RESET}`
	);
	console.log(
		`${RED}If you have made changes to any of the listed files, do NOT run this.${RESET}`
	);
}

async function askForConfirmation(operationDescription: string) {
	const confirm = await prompt(
		`Are you sure you want to ${operationDescription}? (y/N): `
	);

	if (confirm !== "y" && confirm !== "Y") {
		console.log("Operation aborted.");
		process.exit(0);
	}
}

function displayChoices(
	choiceNumber: number,
	promptText: string,
	isNotDisabled: boolean,
	disabledNotice: string
) {
	if (isNotDisabled) {
		console.log(`    ${choiceNumber}) ${promptText}`);
	} else {
		console.log(
			`    ${choiceNumber}) ${promptText} (disabled because ${disabledNotice})`
		);
	}
}

//MARK: Detect project layout

const hasWithoutCustom = directoryExistsInRoots(
	["./public", "./src"],
	"WithoutCustomThemes"
);
const hasManifest = fileExists("./public/manifest.json");
const hasContentScript = fileExists("./src/contentScript.ts");

//MARK: Display choices

console.log("Theme configuration:");
const choiceOneAndTwoDisabledNotice = "'WithoutCustomThemes' was not found";
displayChoices(
	1,
	"Use both predefined and user-defined themes",
	hasWithoutCustom,
	choiceOneAndTwoDisabledNotice
);
displayChoices(
	2,
	"Use ONLY predefined themes",
	hasWithoutCustom,
	choiceOneAndTwoDisabledNotice
);
console.log();

console.log("Firefox extension configurations:");
const choiceThreeDisabledNotice = "'public/manifest.json' was not found";
displayChoices(
	3,
	"Remove ALL firefox extension files",
	hasManifest,
	choiceThreeDisabledNotice
);
const choiceFourDisabledNotice = "'src/contentScript.ts' was not found";
displayChoices(
	4,
	"Remove content script files",
	hasContentScript,
	choiceFourDisabledNotice
);
console.log();

//MARK: Main

async function main() {
	const choiceRaw = await prompt("Enter choice (1/2/3/4): ");
	const choice = choiceRaw.trim();
	switch (choice) {
		case "1": {
			checkIfDisabledChoiceIsSelected(
				1,
				hasWithoutCustom,
				choiceOneAndTwoDisabledNotice
			);

			displayWarning(
				"Removing functionality to use only predefined themes..."
			);

			await askForConfirmation(
				"remove the functionality to use only predefined themes"
			);

			deleteDirectory("./public/WithoutCustomThemes");
			deleteDirectory("./src/components/WithoutCustomThemes");
			deleteDirectory("./src/hooks/WithoutCustomThemes");
			deleteDirectory("./src/theme/WithoutCustomThemes");

			break;
		}

		case "2": {
			checkIfDisabledChoiceIsSelected(
				2,
				hasWithoutCustom,
				choiceOneAndTwoDisabledNotice
			);

			displayWarning(
				"Replacing files with predefined-themes-only counterparts"
			);

			await askForConfirmation(
				"replace files with their predefined-themes-only counterparts"
			);

			const replaceFiles = (fileDirectory: string, fileName: string) => {
				const originalFilePath = path.join(fileDirectory, fileName);
				const themeLessFilePath = path.join(
					fileDirectory,
					"WithoutCustomThemes",
					fileName
				);

				// Replace the original file with the theme-less file
				deleteFile(originalFilePath);
				moveFile(themeLessFilePath, originalFilePath);

				// Update imports in replaced files
				if (fileExists(originalFilePath)) {
					updateFileLog(originalFilePath);

					let content = fs.readFileSync(originalFilePath, "utf8");

					// Remove one `../` from `../../`
					content = content.replace(
						/\.\.\/\.\.\/([^;]*);/g,
						"../$1;"
					);

					// Remove `/WithoutCustomThemes`
					content = content.replace(
						/\/WithoutCustomThemes\/([^;]*);/g,
						"/$1;"
					);

					fs.writeFileSync(originalFilePath, content, "utf8");
				}

				// Delete the theme-less directory if empty
				const withoutDir = path.join(
					fileDirectory,
					"WithoutCustomThemes"
				);
				if (getDirectoryFileNumber(withoutDir) === 0) {
					deleteDirectory(withoutDir);
				}
			};

			replaceFiles("./public", "theme-loader.js");
			replaceFiles("./src/components", "ThemeSwitcher.tsx");
			replaceFiles("./src/hooks", "useTheme.ts");
			replaceFiles("./src/hooks", "useThemeContext.ts");
			replaceFiles("./src/theme", "ThemeContext.ts");
			replaceFiles("./src/theme", "ThemeProvider.tsx");

			break;
		}

		// TODO: REMAKE CASE 3 AND 4 ONCE ROOT/APP ROUTES ARE DONE

		case "3": {
			checkIfDisabledChoiceIsSelected(
				3,
				hasManifest,
				choiceThreeDisabledNotice
			);

			displayWarning("Removing firefox extension functionality...");

			await askForConfirmation("remove firefox extension functionality");

			deleteFile("./src/components/DisplayH1InPage.tsx");
			deleteFile("./src/utils/sendContentScriptMessage.ts");
			deleteFile("./src/types/contentScriptTypes.ts");
			deleteFile("./src/contentScript.ts");
			deleteFile("./public/manifest.json");

			removeNpmPackage("@types/firefox-webext-browser");

			const appPath = "./src/App.tsx";
			if (fileExists(appPath)) {
				updateFileLog(appPath);

				// Remove lines containing DisplayH1InPage
				const content = fs
					.readFileSync(appPath, "utf8")
					.split("\n")
					.filter((l) => !l.includes("DisplayH1InPage"))
					.join("\n");

				fs.writeFileSync(appPath, content, "utf8");
			}

			const viteConfigPath = "./vite.config.ts";
			if (fileExists(viteConfigPath)) {
				updateFileLog(viteConfigPath);

				// Remove block between special comments
				let content = fs.readFileSync(viteConfigPath, "utf8");
				content = content.replace(
					/\/\/! Browser Content Script Only[\s\S]*?\/\/! ---------------------/g,
					""
				);
				fs.writeFileSync(viteConfigPath, content, "utf8");
			}

			const mainPath = "./src/main.tsx";
			if (fileExists(mainPath)) {
				updateFileLog(mainPath);

				// Change from HashRouter to BrowserRouter
				let content = fs.readFileSync(mainPath, "utf8");
				content = content
					.replace("HashRouter", "BrowserRouter")
					.replace("<HashRouter>", "<BrowserRouter>")
					.replace("</HashRouter>", "</BrowserRouter>");
				fs.writeFileSync(mainPath, content, "utf8");
			}

			break;
		}

		case "4": {
			checkIfDisabledChoiceIsSelected(
				4,
				hasContentScript,
				choiceFourDisabledNotice
			);

			displayWarning(
				"Removing firefox extension content script functionality..."
			);

			await askForConfirmation(
				"remove firefox extension content script functionality"
			);

			deleteFile("./src/components/DisplayH1InPage.tsx");
			deleteFile("./src/utils/sendContentScriptMessage.ts");
			deleteFile("./src/types/ContentScript.ts");
			deleteFile("./src/contentScript.ts");

			const appPath = "./src/App.tsx";
			if (fileExists(appPath)) {
				updateFileLog(appPath);

				// Remove lines containing DisplayH1InPage
				const content = fs
					.readFileSync(appPath, "utf8")
					.split("\n")
					.filter((l) => !l.includes("DisplayH1InPage"))
					.join("\n");

				fs.writeFileSync(appPath, content, "utf8");
			}

			const manifestPath = "./public/manifest.json";
			if (fileExists(manifestPath)) {
				updateFileLog(manifestPath);
				try {
					// Update manifest.json safely: remove content_scripts
					const raw = fs.readFileSync(manifestPath, "utf8");
					const obj = JSON.parse(raw);
					if ("content_scripts" in obj) delete obj["content_scripts"];

					fs.writeFileSync(
						manifestPath,
						JSON.stringify(obj, null, "\t"),
						"utf8"
					);
				} catch (err) {
					console.error(
						`${RED}Failed to parse or update manifest.json: ${err}${RESET}`
					);
				}
			}

			const viteConfigPath = "./vite.config.ts";
			if (fileExists(viteConfigPath)) {
				updateFileLog(viteConfigPath);

				// Remove block between special comments
				let content = fs.readFileSync(viteConfigPath, "utf8");
				content = content.replace(
					/\/\/! Browser Content Script Only[\s\S]*?\/\/! ---------------------/g,
					""
				);
				fs.writeFileSync(viteConfigPath, content, "utf8");
			}

			break;
		}

		default:
			console.error("Invalid choice. Exiting.");
			process.exit(1);
	}

	console.log(`Done! Remember to delete this script!`);
	process.exit(0);
}

//MARK: Run main
main().catch((err) => {
	console.error(`${RED}Unexpected error: ${err}${RESET}`);
	process.exit(1);
});
