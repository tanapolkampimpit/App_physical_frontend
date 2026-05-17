import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Mic, Camera, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { SettingToggle } from '../components/features/settings/SettingToggle';
import { IconSizeSelector } from '../components/features/settings/IconSizeSelector';

export const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-28 lg:pb-8 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20 px-4 py-4 flex items-center gap-4 transition-colors">
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">การตั้งค่า (Settings)</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Settings Group */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SettingToggle
              icon={Eye}
              title="ถนอมสายตา (Eye Care Mode)"
              description="ลดแสงสีฟ้าและปรับโทนสีให้อุ่นขึ้น"
              checked={settings.eyeCareMode}
              onChange={(val) => updateSetting('eyeCareMode', val)}
              activeColor="bg-amber-500"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SettingToggle
              icon={Moon}
              title="โหมดมืด (Dark Mode)"
              description="เปลี่ยนธีมแอปพลิเคชันเป็นสีมืด"
              checked={settings.darkMode}
              onChange={(val) => updateSetting('darkMode', val)}
              activeColor="bg-indigo-500"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SettingToggle
              icon={Mic}
              title="เสียง AI แนะนำ (AI Voice)"
              description="เปิดเสียงแนะนำระหว่างทำกายภาพบำบัด"
              checked={settings.aiVoice}
              onChange={(val) => updateSetting('aiVoice', val)}
              activeColor="bg-blue-500"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SettingToggle
              icon={Camera}
              title="เปิดกล้องวิเคราะห์ท่าทาง (Camera)"
              description="ใช้กล้องเพื่อประเมินความแม่นยำของท่าทาง"
              checked={settings.cameraEnabled}
              onChange={(val) => updateSetting('cameraEnabled', val)}
              activeColor="bg-emerald-500"
            />
          </motion.div>
        </div>

        {/* Icon Size Selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <IconSizeSelector
            value={settings.iconSize}
            onChange={(val) => updateSetting('iconSize', val)}
          />
        </motion.div>

      </div>
    </div>
  );
};
