export class WorkoutSessionConflictError extends Error {
  constructor() {
    super("Você já tem um treino em andamento. Conclua ou descarte antes de começar outro.");
    this.name = "WorkoutSessionConflictError";
  }
}

export class NoCompletedSetsError extends Error {
  constructor() {
    super("Conclua pelo menos uma série antes de finalizar o treino.");
    this.name = "NoCompletedSetsError";
  }
}

export class SetIncompleteError extends Error {
  constructor() {
    super("A série precisa de pelo menos 1 repetição para ser concluída.");
    this.name = "SetIncompleteError";
  }
}

export class WorkoutNotFoundError extends Error {
  constructor() {
    super("Não encontramos esse treino.");
    this.name = "WorkoutNotFoundError";
  }
}
