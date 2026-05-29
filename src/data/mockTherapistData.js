// Mock Data for Physiotherapist Dashboard

export const MOCK_PATIENTS = [
  {
    id: 'pt-001',
    name: 'สมชาย รักดี',
    age: 45,
    gender: 'Male',
    condition: 'Frozen Shoulder (ไหล่ติด)',
    phase: 'Sub-acute',
    targetArea: 'shoulder',
    painScale: 4, // 0-10
    complianceScore: 85, // %
    lastActive: '2023-11-15T08:30:00Z',
    status: 'active', // active, attention, completed
    avatarBg: 'bg-blue-100 text-blue-600',
    history: [
      { date: '2023-11-10', pain: 6, reps: 10 },
      { date: '2023-11-12', pain: 5, reps: 12 },
      { date: '2023-11-14', pain: 4, reps: 15 },
      { date: '2023-11-15', pain: 4, reps: 15 },
    ],
    assignedPrograms: [
      { exerciseId: 1, targetReps: 10, sets: 2 },
      { exerciseId: 2, targetReps: 10, sets: 2 }
    ]
  },
  {
    id: 'pt-002',
    name: 'นงเยาว์ สุขใจ',
    age: 62,
    gender: 'Female',
    condition: 'Osteoarthritis Knee (ข้อเข่าเสื่อม)',
    phase: 'Chronic',
    targetArea: 'knee',
    painScale: 7, 
    complianceScore: 45, // Low compliance -> needs attention
    lastActive: '2023-11-10T14:15:00Z',
    status: 'attention',
    avatarBg: 'bg-rose-100 text-rose-600',
    history: [
      { date: '2023-11-01', pain: 6, reps: 10 },
      { date: '2023-11-05', pain: 7, reps: 5 },
      { date: '2023-11-10', pain: 7, reps: 8 },
    ],
    assignedPrograms: [
      { exerciseId: 3, targetReps: 10, sets: 3 },
      { exerciseId: 4, targetReps: 12, sets: 3 }
    ]
  },
  {
    id: 'pt-003',
    name: 'วิชัย เก่งการ',
    age: 35,
    gender: 'Male',
    condition: 'Office Syndrome (ปวดเมื่อยทั่วไป)',
    phase: 'Chronic',
    targetArea: 'all',
    painScale: 2,
    complianceScore: 95,
    lastActive: '2023-11-16T18:45:00Z',
    status: 'active',
    avatarBg: 'bg-emerald-100 text-emerald-600',
    history: [
      { date: '2023-11-13', pain: 4, reps: 20 },
      { date: '2023-11-14', pain: 3, reps: 20 },
      { date: '2023-11-15', pain: 2, reps: 25 },
      { date: '2023-11-16', pain: 2, reps: 25 },
    ],
    assignedPrograms: [
      { exerciseId: 6, targetReps: 15, sets: 3 }
    ]
  },
  {
    id: 'pt-004',
    name: 'ประเสริฐ อดทน',
    age: 58,
    gender: 'Male',
    condition: 'Hemiplegia (อัมพาตครึ่งซีก)',
    phase: 'Acute',
    targetArea: 'all',
    painScale: 8,
    complianceScore: 60,
    lastActive: '2023-11-15T10:00:00Z',
    status: 'attention',
    avatarBg: 'bg-amber-100 text-amber-600',
    history: [
      { date: '2023-11-10', pain: 9, reps: 5 },
      { date: '2023-11-12', pain: 8, reps: 6 },
      { date: '2023-11-15', pain: 8, reps: 8 },
    ],
    assignedPrograms: [
      { exerciseId: 101, targetReps: 10, sets: 2 },
      { exerciseId: 102, targetReps: 10, sets: 2 }
    ]
  }
];

export const MOCK_OVERVIEW_STATS = {
  totalPatients: 142,
  activeThisWeek: 87,
  needsAttention: 12,
  avgCompliance: 76 // %
};
