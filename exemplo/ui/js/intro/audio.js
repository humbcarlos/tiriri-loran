window.onload = () => {
  setTimeout(() => {
    audio.volume = 0;
    audio.play().then(() => {
      let vol = 0;
      const fade = setInterval(() => {
        vol += 0.02;
        if (vol > Config.audio.musicVolume) vol = Config.audio.musicVolume;
        audio.volume = vol;
        if (vol >= Config.audio.musicVolume) clearInterval(fade);
      }, 200);
    }).catch(() => {});
    
    setTimeout(() => {
      ambient.volume = 0;
      ambient.play().then(() => {
        let vol = 0;
        const fadeAmbient = setInterval(() => {
          vol += 0.01;
          if (vol > Config.audio.ambientVolume) vol = Config.audio.ambientVolume;
          ambient.volume = vol;
          if (vol >= Config.audio.ambientVolume) clearInterval(fadeAmbient);
        }, 200);
      }).catch(() => {});
    }, 2000);
  }, 1000);
};
