import { methods } from './methods';

export function transform(methodId, input, settings, mode = 'encode') {
  if (!input) return { success: true, output: "" };

  const method = methods.find(m => m.id === methodId);
  if (!method) {
    return { success: false, error: `Method ${methodId} not found.` };
  }

  try {
    const output = mode === 'encode' 
      ? method.encode(input, settings)
      : method.decode(input, settings);
      
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
