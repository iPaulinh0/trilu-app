import type { TriluMuscleGroup } from "./types";

/**
 * Controlled classification from ExerciseDB's free-text muscle/body-part
 * vocabulary (confirmed live against GET /api/v1/muscles and
 * /api/v1/bodyparts on oss.exercisedb.dev) to Trilu's fixed muscle groups.
 * Deliberately NOT a translation layer — see search-aliases.ts for that.
 */
const MUSCLE_TO_GROUP: Record<string, TriluMuscleGroup> = {
  chest: "chest",
  pectorals: "chest",
  "upper chest": "chest",

  back: "back",
  lats: "back",
  "latissimus dorsi": "back",
  "upper back": "back",
  "lower back": "back",
  traps: "back",
  trapezius: "back",
  rhomboids: "back",
  "levator scapulae": "back",
  "serratus anterior": "back",
  spine: "back",

  shoulders: "shoulders",
  deltoids: "shoulders",
  delts: "shoulders",
  "rear deltoids": "shoulders",
  "rotator cuff": "shoulders",

  biceps: "biceps",
  brachialis: "biceps",

  triceps: "triceps",

  forearms: "forearms",
  wrists: "forearms",
  "wrist extensors": "forearms",
  "wrist flexors": "forearms",
  hands: "forearms",
  "grip muscles": "forearms",

  quadriceps: "quadriceps",
  quads: "quadriceps",

  hamstrings: "hamstrings",

  glutes: "glutes",
  "hip flexors": "glutes",
  groin: "glutes",
  adductors: "glutes",
  abductors: "glutes",
  "inner thighs": "glutes",

  calves: "calves",
  shins: "calves",
  soleus: "calves",
  ankles: "calves",
  "ankle stabilizers": "calves",
  feet: "calves",

  abs: "core",
  abdominals: "core",
  obliques: "core",
  core: "core",
  "lower abs": "core",

  "cardiovascular system": "cardio",

  sternocleidomastoid: "other",
  neck: "other",
};

const BODY_PART_TO_GROUP: Record<string, TriluMuscleGroup> = {
  neck: "other",
  "lower arms": "forearms",
  shoulders: "shoulders",
  cardio: "cardio",
  "upper arms": "other",
  chest: "chest",
  "lower legs": "calves",
  back: "back",
  "upper legs": "other",
  waist: "core",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Classifies a single provider muscle/body-part string into a Trilu group. */
export function classifyMuscle(value: string): TriluMuscleGroup {
  const key = normalize(value);
  return MUSCLE_TO_GROUP[key] ?? BODY_PART_TO_GROUP[key] ?? "other";
}

/**
 * An exercise's normalized primary group (from its first target muscle,
 * falling back to its first body part) and secondary groups (from
 * secondary muscles), deduplicated and excluding the primary.
 */
export function classifyExercise(params: {
  targetMuscles: string[];
  secondaryMuscles: string[];
  bodyParts: string[];
}): { primaryMuscleGroup: TriluMuscleGroup; secondaryMuscleGroups: TriluMuscleGroup[] } {
  const primarySource = params.targetMuscles[0] ?? params.bodyParts[0];
  const primaryMuscleGroup = primarySource ? classifyMuscle(primarySource) : "other";
  const secondaryMuscleGroups = [
    ...new Set(params.secondaryMuscles.map(classifyMuscle).filter((g) => g !== primaryMuscleGroup)),
  ];
  return { primaryMuscleGroup, secondaryMuscleGroups };
}

/** Reverse lookup: which raw provider muscle strings feed a Trilu group (for filtering). */
export function getProviderMusclesForGroup(group: TriluMuscleGroup): string[] {
  return Object.entries(MUSCLE_TO_GROUP)
    .filter(([, g]) => g === group)
    .map(([muscle]) => muscle);
}

/** Controlled equipment translation — never a fragile automatic translation. */
const EQUIPMENT_LABELS: Record<string, string> = {
  "stepmill machine": "Escada ergométrica",
  "elliptical machine": "Elíptico",
  "trap bar": "Barra hexagonal",
  tire: "Pneu",
  "stationary bike": "Bicicleta ergométrica",
  "wheel roller": "Roda abdominal",
  "smith machine": "Máquina Smith",
  hammer: "Martelo",
  "skierg machine": "SkiErg",
  roller: "Rolo",
  "resistance band": "Faixa elástica",
  "bosu ball": "Bosu",
  weighted: "Com peso",
  "olympic barbell": "Barra olímpica",
  kettlebell: "Kettlebell",
  "upper body ergometer": "Ergômetro de membros superiores",
  "sled machine": "Sled",
  "ez barbell": "Barra EZ",
  dumbbell: "Halteres",
  rope: "Corda",
  barbell: "Barra",
  band: "Elástico",
  "stability ball": "Bola suíça",
  "medicine ball": "Bola medicinal",
  assisted: "Assistido",
  "leverage machine": "Máquina articulada",
  cable: "Cabo (polia)",
  "body weight": "Peso do corpo",
};

export function getEquipmentLabel(rawEquipment: string): string {
  const key = normalize(rawEquipment);
  return EQUIPMENT_LABELS[key] ?? rawEquipment;
}

export const KNOWN_EQUIPMENT_KEYS = Object.keys(EQUIPMENT_LABELS);
