import { motion } from 'framer-motion';

const FacebookIcon = () => (
  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const OnboardingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-screen flex flex-col justify-between font-body-md text-[18px]"
    >
      <header className="flex justify-center items-center px-margin-mobile min-h-[64px] h-[64px] w-full bg-surface shadow-[0_4px_12px_0px_rgba(0,0,0,0.05)] z-50">
        <h1 className="font-headline-md text-[28px] font-bold text-primary">PhysioPro</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-8 max-w-lg mx-auto w-full">
        <div className="w-full aspect-square mb-8 rounded-xl overflow-hidden shadow-[0_4px_12px_0px_rgba(0,0,0,0.05)] bg-surface-container-lowest flex items-center justify-center p-4">
          <img
            alt="Physical therapy session illustration"
            className="w-full h-full object-cover rounded-lg"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCakJohwtKXvBwQ7SUsPNTS3U8D4OffIGTRV7ohrx2opMolbqY9U_1-fW3NkmdXYzDRLpbYbqSjMyJuzi2sphMCs9gJJkL-5_cCF2duXdPnvSd-ABQ7Ds8EG_Jn1EH583RDEXcsVFx27pBXR6g6IVZHtZ7WQERC-zD6aoU-iGVyxke0IESkGi0gO1ZglyqYVzzNzZ5KMV67oFJQFvOYGsrgTS1czCBas1C7A5KxjixGNuRwt4tKHkYw5Z8bjlBy4ql1Es7tSAbBA9gu"
          />
        </div>

        <div className="text-center space-y-6 w-full">
          <h2 className="font-display-lg text-[32px] leading-[40px] text-on-surface font-bold">
            Your recovery, guided by experts
          </h2>
          <p className="font-body-lg text-[20px] leading-[30px] text-on-surface max-w-[90%] mx-auto">
            Evidence-based physical therapy plans tailored to your specific needs, designed for
            clinical excellence and cognitive ease.
          </p>
        </div>
      </main>

      <footer className="px-margin-mobile pb-8 w-full max-w-lg mx-auto space-y-4">
        <button
          type="button"
          className="w-full min-h-[56px] h-[56px] bg-primary-container text-on-primary font-headline-sm text-[20px] font-semibold rounded-xl flex items-center justify-center shadow-[0_4px_12px_0px_rgba(0,0,0,0.05)] hover:bg-primary transition-colors active:shadow-none active:bg-on-primary-fixed-variant"
        >
          Get Started
        </button>

        <div className="space-y-4 mt-4">
          <button
            type="button"
            className="w-full min-h-[56px] h-[56px] bg-[#06C755] text-white font-headline-sm text-[20px] font-semibold rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_12px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition-opacity"
          >
            <img
              alt="LINE"
              className="w-8 h-8"
              src="https://upload.wikimedia.org/wikipedia/commons/2/2e/LINE_New_App_Icon_%282020-12%29.png"
            />
            Login with LINE
          </button>

          <button
            type="button"
            className="w-full min-h-[56px] h-[56px] bg-[#1877F2] text-white font-headline-sm text-[20px] font-semibold rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_12px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition-opacity"
          >
            <FacebookIcon />
            Login with Facebook
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="font-body-lg text-[18px] text-primary hover:underline bg-transparent min-h-[48px] px-4 font-medium flex items-center justify-center w-full"
          >
            Already have an account? Log in
          </button>
        </div>
      </footer>
    </motion.div>
  );
};
