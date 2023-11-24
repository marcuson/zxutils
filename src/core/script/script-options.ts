export interface ScriptOptions {
  enableStepTracking: boolean;
}

const defaultScriptOptions: ScriptOptions = {
  enableStepTracking: false,
};

export function fillDefaultScriptOptions(
  options?: Partial<ScriptOptions>
): ScriptOptions {
  const res = { ...defaultScriptOptions, ...options };
  return res;
}
