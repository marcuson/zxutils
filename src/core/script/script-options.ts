export interface ScriptOptions {
  enableStepTracking: boolean;
  verbose: boolean;
}

const defaultScriptOptions: ScriptOptions = {
  enableStepTracking: false,
  verbose: true,
};

export function fillDefaultScriptOptions(
  options?: Partial<ScriptOptions>
): ScriptOptions {
  const res = { ...defaultScriptOptions, ...options };
  return res;
}
