console.time('Search Finished IN');
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'path';

const excludedDirs = new Set(['.git', 'node_modules', 'dist', '.idea', '.husky']);
const listDefaultsKeys = new Set(['PWD']);

const keysNotInExample = new Set();
const exampleFile = readFileSync('.env.example').toString();
const exampleKeys = new Set(
    exampleFile
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => line.split('=')[0]),
);
const keysNotInSchema: Set<string> = new Set();
const allUsedKeys: Set<string> = new Set();

/**
 * Searches the specified directory for TypeScript files and checks for environment variable usage.
 * @param directoryPath The path of the directory to search.
 */
function searchDirectory(directoryPath: string) {
    const files = readdirSync(directoryPath);
    files.forEach((file) => {
        const filePath = join(directoryPath, file);
        const stats = statSync(filePath);
        if (stats.isDirectory() && !excludedDirs.has(file)) {
            searchDirectory(filePath);
        } else if (stats.isFile() && file.endsWith('.tsx')) {
            const data = readFileSync(filePath).toString();
            const matches = data.match(new RegExp(/process\.env\.\w+/, 'g'));
            if (matches) {
                matches.forEach((match) => {
                    const key = match.split('process.env.').pop()?.trim();
                    if (key) {
                        allUsedKeys.add(key);
                        if (!listDefaultsKeys.has(key)) {
                            if (!exampleKeys.has(key)) {
                                keysNotInExample.add(key);
                            }
                        }
                    }
                });
            }
        } else if (stats.isFile() && file.endsWith('.yml')) {
            const data = readFileSync(filePath).toString();
            const matches = data.match(new RegExp(/\$\{\s*\w+\s*(-\s*\w+\s*)?}/, 'g'));
            if (matches) {
                matches.forEach((match) => {
                    const key = match.match(/\w+/)?.pop()?.trim();
                    if (key) {
                        allUsedKeys.add(key);
                        if (!listDefaultsKeys.has(key)) {
                            if (!exampleKeys.has(key)) {
                                keysNotInExample.add(key);
                            }
                        }
                    }
                });
            }
        }
    });
}

const directoryToSearch = '.';
searchDirectory(directoryToSearch);
let error = '';
if (keysNotInExample.size > 0) {
    error += `Keys not in example keys: \n${Array.from(keysNotInExample).join('\n')}`;
}

if (keysNotInSchema.size > 0) {
    error += `${error ? '\n\n' : ''}Keys not in joy schema keys: \n${Array.from(keysNotInSchema).join('\n')}`;
}

const exampleNotUsed = Array.from(exampleKeys).filter((exKey) => !allUsedKeys.has(exKey));
if (exampleNotUsed.length > 0) {
    error += `${error ? '\n\n' : ''}Keys not used in example: \n${exampleNotUsed.join('\n')}`;
}

if (error) {
    console.timeEnd('Search Finished IN');
    throw new Error(error);
}
console.timeEnd('Search Finished IN');