import { TeacherContextProvider } from './TeacherContext';
import { StudentContextProvider } from './StudentContext';
import { combineComponents } from '../utils/combineComponents';

const providers = [
  TeacherContextProvider,
  StudentContextProvider,
]

export const AppContextProvider = combineComponents(...providers);
