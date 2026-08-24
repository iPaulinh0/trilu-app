# Trilu App — UI kit

A click-through recreation of the Trilu mobile app as described in the brand kit (section `09 • PRODUTO`). 390×844 phone frame, bottom TabBar, one primary action per screen.

Open `index.html`. Flow: **Onboarding → Trilha (home) → Treino → Companheiros → Perfil**. "Rever a introdução" in Perfil returns to onboarding.

| File | Screen |
| --- | --- |
| `PhoneFrame.jsx` | Device shell, status bar, bottom `TabBar`, `Ico` Lucide helper |
| `OnboardingScreen.jsx` | Tilu welcome + goal selection (`Radio` cards) |
| `HomeScreen.jsx` | Trilha with `TrailPath`, missão do dia, semana, stats |
| `WorkoutScreen.jsx` | Live treino: `ExerciseRow` list, progress, celebration `Toast`, `Dialog` |
| `FriendsScreen.jsx` | Companheiros list + marcos feed (no ranking, by brand rule) |
| `ProfileScreen.jsx` | Stats, hábitos, ajustes |

Everything visible is composed from the design-system components — no primitive is re-implemented here.

**Source caveat:** the brand kit describes the home screen in words and a small wireframe ("avatar na trilha, próximo marco, missão do dia e um único botão principal"). There is no production codebase or Figma file, so screens beyond the home screen are constructed from the brand kit's stated rules rather than copied from an existing design. Treat them as the system's proposal, not a recreation.
