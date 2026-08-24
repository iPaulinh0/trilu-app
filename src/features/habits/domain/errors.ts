export class HabitLimitReachedError extends Error {
  constructor() {
    super("Você já tem 8 hábitos ativos. Pause ou remova um para adicionar outro.");
    this.name = "HabitLimitReachedError";
  }
}

export class HabitNotFoundError extends Error {
  constructor() {
    super("Não encontramos esse hábito.");
    this.name = "HabitNotFoundError";
  }
}
