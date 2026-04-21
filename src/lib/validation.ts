export function validateUUID(id: unknown, fieldName: string): string | null {
  if (typeof id !== "string" || !id.trim()) {
    return `${fieldName} é obrigatório`;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return `${fieldName} inválido`;
  }
  return null;
}

export function validateNumber(value: unknown, fieldName: string, min?: number, max?: number): string | null {
  if (typeof value !== "number" || isNaN(value)) {
    return `${fieldName} é obrigatório e deve ser um número`;
  }
  if (min !== undefined && value < min) {
    return `${fieldName} deve ser pelo menos ${min}`;
  }
  if (max !== undefined && value > max) {
    return `${fieldName} deve ser no máximo ${max}`;
  }
  return null;
}

export function validateString(value: unknown, fieldName: string, minLength = 1, maxLength = 500): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return `${fieldName} é obrigatório`;
  }
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  if (value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return null;
}

export function validateAnswerPayload(payload: any): string[] {
  const errors: string[] = [];

  const gameIdError = validateUUID(payload.gameId, "gameId");
  if (gameIdError) errors.push(gameIdError);

  const playerIdError = validateUUID(payload.playerId, "playerId");
  if (playerIdError) errors.push(playerIdError);

  const questionIdError = validateUUID(payload.questionId, "questionId");
  if (questionIdError) errors.push(questionIdError);

  const chosenOptionError = validateNumber(payload.chosenOption, "chosenOption", 0, 3);
  if (chosenOptionError) errors.push(chosenOptionError);

  const timeTakenError = validateNumber(payload.timeTaken, "timeTaken", 0, 300);
  if (timeTakenError) errors.push(timeTakenError);

  return errors;
}

export function validateGeneratePayload(payload: any): string[] {
  const errors: string[] = [];

  const promptError = validateString(payload.prompt, "prompt", 1, 200);
  if (promptError) errors.push(promptError);

  if (payload.count !== undefined) {
    const countError = validateNumber(payload.count, "count", 1, 20);
    if (countError) errors.push(countError);
  }

  if (payload.ageRating !== undefined && typeof payload.ageRating !== "string") {
    errors.push("ageRating deve ser uma string");
  }

  return errors;
}