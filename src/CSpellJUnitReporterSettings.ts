/**
 * CSpell-junit-reporter settings type definition
 */
export type CSpellJUnitReporterSettings = {
    /**
     * Path to the output file.
     *
     * Relative paths are relative to the current working directory.
     *
     * Special values:
     * - `stdout` - write the XML to `stdout`.
     * - `stderr` - write the XML to `stderr`.
     *
     * @default stdout
     */
    outFile?: string;
    /**
     * Add more information about the files being checked and the configuration
     * @default false
     */
    verbose?: boolean;
    /**
     * Add information useful for debugging
     * @default false
     */
    debug?: boolean;
    /**
     * Add progress messages
     * @default false
     */
    progress?: boolean;
};