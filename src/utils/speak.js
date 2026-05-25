export const speakThai = (text) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'th-TH';
  msg.rate = 1.0;
  msg.volume = 1.0;

  const play = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log("All available voices:", voices.map(v => v.lang + ' - ' + v.name));
    
    // ค้นหาเสียงภาษาไทยจากรายการเสียงทั้งหมด รองรับ th-TH, th, th_TH
    const thaiVoice = voices.find(voice => voice.lang.toLowerCase().includes('th'));
    if (thaiVoice) {
      msg.voice = thaiVoice;
      console.log("Selected Thai voice:", thaiVoice.name);
    } else {
      console.warn("No Thai voice found! Using default voice.");
    }
    
    console.log("Speaking text:", text);
    window.speechSynthesis.speak(msg);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    play();
  } else {
    let played = false;

    const onVoicesChanged = () => {
      if (played) return;
      played = true;
      play();
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    
    setTimeout(() => {
      if (!played) {
        played = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        play();
      }
    }, 500);
  }
};
