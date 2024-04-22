import { AssertionError } from 'node:assert';

import type { CSpellJUnitReporterSettings } from '../CSpellJUnitReporterSettings.js';

function assertBooleanOrUndefined(key: string, value: unknown): asserts value is boolean | undefined {
    if (typeof value !== 'boolean' && value !== undefined) {
        throw new AssertionError({
            message: `cspell-junit-reporter settings.${key} must be a boolean`,
            actual: typeof value,
            expected: 'boolean',
        });
    }
}

/**
 * Throws an error if passed cspell-junit-reporter settings are invalid
 */
export function validateSettings(settings: unknown): asserts settings is CSpellJUnitReporterSettings {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        throw new AssertionError({
            message: 'cspell-junit-reporter settings must be an object',
            actual: typeof settings,
            expected: 'object',
        });
    }

    const { outFile = 'stdout', debug, verbose, progress } = settings as CSpellJUnitReporterSettings;

    if (typeof outFile !== 'string') {
        throw new AssertionError({
            message: 'cspell-junit-reporter settings.outFile must be a string',
            actual: typeof outFile,
            expected: 'string',
        });
    }

    assertBooleanOrUndefined('verbose', verbose);
    assertBooleanOrUndefined('debug', debug);
    assertBooleanOrUndefined('progress', progress);
}