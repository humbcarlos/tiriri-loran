function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  clockTime.textContent = `${hours}:${minutes} ${ampm}`;
  
  if (Config.clock.showDate) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    clockDate.textContent = now.toLocaleDateString('pt-BR', options);
  }
}
