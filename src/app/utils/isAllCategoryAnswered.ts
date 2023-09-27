import { LocalStorageKeys } from '../data/programmedPhases';

const isAllCategoryAnswered = () => {
  const definitionScore = localStorage.getItem(
    LocalStorageKeys.DEFINITION_SCORE,
  );
  const examplesScore = localStorage.getItem(LocalStorageKeys.EXAMPLES_SCORE);
  const modelsScore = localStorage.getItem(LocalStorageKeys.MODELS_SCORE);
  const modelsExist = typeof modelsScore === 'string';
  const examplesExist = typeof examplesScore === 'string';
  const definitionExist = typeof definitionScore === 'string';

  return modelsExist && examplesExist && definitionExist;
};

export default isAllCategoryAnswered;
