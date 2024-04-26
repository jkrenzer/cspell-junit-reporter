import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import type { CSpellReporter, ReporterConfiguration } from '@cspell/cspell-types';
import { MessageTypes } from '@cspell/cspell-types';

import type { CSpellJUnitReporterOutput } from './CSpellJUnitReporterOutput.js';
import type { CSpellJUnitReporterSettings } from './CSpellJUnitReporterSettings.js';
import { validateSettings } from './utils/validateSettings.js';
import { makeJUnitXML } from './utils/buildJUnitFile.js';

function mkdirp(p: string) {
    return fs.mkdir(p, { recursive: true });
}

const noopReporter = () => undefined;

const STDOUT = 'stdout';
const STDERR = 'stderr';

type Data = Omit<CSpellJUnitReporterOutput, 'result'>;

export function getReporter(
    settings: unknown | CSpellJUnitReporterSettings,
    cliOptions?: ReporterConfiguration,
): Required<CSpellReporter> {
    const useSettings = normalizeSettings(settings);
    const reportData: Data = { issues: [], info: [], debug: [], error: [], progress: [] };
    return {
        issue: (issue) => {
            reportData.issues.push(issue);
        },
        info: (message, msgType) => {
            if (msgType === MessageTypes.Debug && !useSettings.debug) {
                return;
            }
            if (msgType === MessageTypes.Info && !useSettings.verbose) {
                return;
            }
            reportData.info = push(reportData.info, { message, msgType });
        },
        debug: useSettings.debug
            ? (message) => {
                reportData.debug = push(reportData.debug, { message });
            }
            : noopReporter,
        error: (message, error) => {
            reportData.error = push(reportData.error, { message, error });
        },
        progress: (item) => {
            reportData.progress = push(reportData.progress, item);
        },
        result: async (result) => {
            const outFile = useSettings.outFile || STDOUT;
            const output = {
                ...reportData,
                result,
            };
            const xmlData = makeJUnitXML(reportData.issues, reportData.progress);
            if (outFile === STDOUT) {
                console.log(xmlData);
                return;
            }
            if (outFile === STDERR) {
                console.error(xmlData);
                return;
            }
            const outFilePath = path.join(cliOptions?.root ?? process.cwd(), outFile);
            await mkdirp(path.dirname(outFilePath));
            return fs.writeFile(outFilePath, xmlData);
        },
    };
}

function normalizeSettings(settings: unknown | CSpellJUnitReporterSettings): CSpellJUnitReporterSettings {
    if (settings === undefined) return { outFile: STDOUT };
    validateSettings(settings);
    return settings;
}

function push<T>(src: T[] | undefined, value: T): T[] {
    if (src) {
        src.push(value);
        return src;
    }
    return [value];
}