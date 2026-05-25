import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Heart, ChevronDown, Check, Activity, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all cursor-text',
      className
    )}
    {...props}
  />
);

const SelectField = ({ children, ...props }) => (
  <div className="relative">
    <select
      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all cursor-pointer"
      {...props}
    >
      {children}
    </select>
    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
  </div>
);

const SectionCard = ({ icon: Icon, title, delay, children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 dark:border-gray-700">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
        <Icon size={15} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h2>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </motion.div>
);

export const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    condition: '',
    painScale: 0,
    limitations: '',
    usageMode: 'self',
    emergencyContactName: '',
    emergencyPhone: '',
  });
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const bmi =
    formData.weight && formData.height
      ? (parseFloat(formData.weight) / (parseFloat(formData.height) / 100) ** 2).toFixed(1)
      : null;

  const bmiInfo = bmi
    ? bmi < 18.5 ? { text: 'ต่ำกว่าเกณฑ์', color: 'text-blue-500 bg-blue-50' }
    : bmi < 25 ? { text: 'ปกติ', color: 'text-emerald-600 bg-emerald-50' }
    : bmi < 30 ? { text: 'น้ำหนักเกิน', color: 'text-yellow-600 bg-yellow-50' }
    : { text: 'อ้วน', color: 'text-red-500 bg-red-50' }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 pt-12 pb-16 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-6"
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-lg flex-shrink-0">
              <User size={36} className="text-white" />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                {formData.fullName || 'ชื่อของคุณ'}
              </h1>
              <p className="text-emerald-100 text-sm">
                {formData.condition
                  ? formData.condition.replace(/-/g, ' ')
                  : 'ยังไม่ระบุอาการ'}
              </p>
            </div>
            {bmi && (
              <div className="lg:ml-auto flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Activity size={18} className="text-white/80" />
                <div>
                  <p className="text-white/70 text-xs">BMI</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">{bmi}</span>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-lg', bmiInfo?.color)}>
                      {bmiInfo?.text}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-6 pb-8">
        {/* Desktop: 2-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard icon={User} title="ข้อมูลส่วนตัว" delay={0.1}>
            <Field label="ชื่อ-นามสกุล">
              <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="กรอกชื่อ-นามสกุล" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="อายุ">
                <Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="ปี" />
              </Field>
              <Field label="เพศ">
                <SelectField name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">เลือก</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                </SelectField>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="น้ำหนัก (กก.)">
                <Input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="กก." />
              </Field>
              <Field label="ส่วนสูง (ซม.)">
                <Input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="ซม." />
              </Field>
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard icon={Heart} title="ข้อมูลทางการแพทย์" delay={0.15}>
              <Field label="อาการ / การวินิจฉัย">
                <SelectField name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="">เลือกอาการ</option>
                  <option value="post-op-knee">ผ่าตัดเข่า</option>
                  <option value="lower-back-pain">ปวดหลังส่วนล่าง</option>
                  <option value="stroke">โรคหลอดเลือดสมอง</option>
                  <option value="arthritis">ข้ออักเสบ</option>
                  <option value="shoulder-injury">บาดเจ็บไหล่</option>
                </SelectField>
              </Field>
              <Field label="ระดับความปวด (0-10)">
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="range"
                    name="painScale"
                    min="0"
                    max="10"
                    value={formData.painScale}
                    onChange={handleChange}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="w-8 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {formData.painScale}
                  </span>
                </div>
              </Field>
              <Field label="ข้อจำกัดทางร่างกาย / ประวัติการผ่าตัด">
                <Input
                  name="limitations"
                  value={formData.limitations}
                  onChange={handleChange}
                  placeholder="เช่น ผ่าตัดเปลี่ยนข้อเข่า, ปวดไหล่ขวา"
                />
              </Field>
              <Field label="รูปแบบการใช้งานแอป">
                <SelectField name="usageMode" value={formData.usageMode} onChange={handleChange}>
                  <option value="self">ออกกำลังกายด้วยตนเอง</option>
                  <option value="caregiver">โหมดผู้ดูแล (สอนผู้อื่น)</option>
                </SelectField>
              </Field>
            </SectionCard>

            <SectionCard icon={Phone} title="ผู้ติดต่อฉุกเฉิน" delay={0.2}>
              <Field label="ชื่อผู้ติดต่อ">
                <Input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="ชื่อผู้ติดต่อ" />
              </Field>
              <Field label="เบอร์โทรศัพท์">
                <Input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="0xx-xxx-xxxx" />
              </Field>
            </SectionCard>
          </div>
        </div>

        {/* Settings Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4"
        >
          <a
            href="/settings"
            onClick={(e) => {
              e.preventDefault();
              navigate('/settings');
            }}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                <SettingsIcon size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">การตั้งค่าแอปพลิเคชัน</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">ปรับแต่งการแสดงผลและฟังก์ชัน</p>
              </div>
            </div>
            <ChevronDown size={20} className="text-gray-400 -rotate-90" />
          </a>
        </motion.div>

        {/* Save button — inline on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={cn(
              'px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-md',
              saved
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200 hover:shadow-emerald-300'
            )}
          >
            {saved ? <><Check size={16} /><span>บันทึกแล้ว</span></> : 'บันทึกข้อมูล'}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile fixed save button */}
      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 transition-colors z-50">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={cn(
            'w-full font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg',
            saved
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200 dark:shadow-none'
          )}
        >
          {saved ? <><Check size={18} /><span>บันทึกแล้ว</span></> : 'บันทึกข้อมูล'}
        </motion.button>
      </div>
    </div>
  );
};
