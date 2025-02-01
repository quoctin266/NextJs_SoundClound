// Define the waveform gradient

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;

export const drawWaveColor = () => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1);
  gradient.addColorStop(0, "white"); // Top color
  gradient.addColorStop((canvas.height * 0.7) / canvas.height, "white"); // Top color
  gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#000"); // White line
  // gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
  gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#e5e5e5"); // Bottom color
  gradient.addColorStop(1, "#e5e5e5"); // Bottom color

  return gradient;
};

// Define the progress gradient
export const drawProgressColor = () => {
  const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1);
  progressGradient.addColorStop(0, "#EE772F"); // Top color
  progressGradient.addColorStop(
    (canvas.height * 0.7) / canvas.height,
    "#ff4a00"
  ); // Top color
  progressGradient.addColorStop(
    (canvas.height * 0.7 + 1) / canvas.height,
    "#000"
  ); // White line
  progressGradient.addColorStop(
    (canvas.height * 0.7 + 3) / canvas.height,
    "#F6B094"
  ); // Bottom color
  progressGradient.addColorStop(1, "#F6B094"); // Bottom color

  return progressGradient;
};
