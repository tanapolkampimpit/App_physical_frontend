import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Welcome } from './pages/Welcome';
import { Assessment } from './pages/Assessment';
import { Profile } from './pages/Profile';
import { Programs } from './pages/Programs';
import { CaregiverPrograms } from './pages/CaregiverPrograms';
import { ExercisePreview } from './pages/ExercisePreview';
import { Exercise } from './pages/Exercise';
import { CaregiverExercise } from './pages/CaregiverExercise';
import { Report } from './pages/Report';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import { TherapistDashboard } from './pages/TherapistDashboard';
import { PatientDetail } from './pages/PatientDetail';

export const App = () => {
  return (
    <SettingsProvider>
      <Routes>
        <Route path="/" element={<Layout showNav={false}><Welcome /></Layout>} />
        <Route
          path="/welcome"
          element={
            <Layout showNav={true}>
              <Welcome />
            </Layout>
          }
        />
        <Route
          path="/assessment"
          element={
            <Layout showNav={true}>
              <Assessment />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout showNav={true}>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/programs"
          element={
            <Layout showNav={true}>
              <Programs />
            </Layout>
          }
        />
        <Route
          path="/caregiver-programs"
          element={
            <Layout showNav={true}>
              <CaregiverPrograms />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout showNav={false}>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/exercise/:id/preview"
          element={
            <Layout showNav={false}>
              <ExercisePreview />
            </Layout>
          }
        />
        <Route
          path="/exercise/:id"
          element={
            <Layout showNav={false}>
              <Exercise />
            </Layout>
          }
        />
        <Route
          path="/caregiver-exercise/:id"
          element={
            <Layout showNav={false}>
              <CaregiverExercise />
            </Layout>
          }
        />
        <Route
          path="/report/:sessionId"
          element={
            <Layout showNav={false}>
              <Report />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout showNav={true}>
              <History />
            </Layout>
          }
        />
        <Route
          path="/therapist/dashboard"
          element={
            <Layout showNav={false}>
              <TherapistDashboard />
            </Layout>
          }
        />
        <Route
          path="/therapist/patient/:id"
          element={
            <Layout showNav={false}>
              <PatientDetail />
            </Layout>
          }
        />
      </Routes>
    </SettingsProvider>
  );
};
