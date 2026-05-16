import { Routes, Route } from 'react-router-dom';
import { OnboardingPage } from './pages/OnboardingPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
    </Routes>
  );
};
