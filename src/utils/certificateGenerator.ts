
export interface CertificateData {
  name: string;
  score: number;
  date: string;
  location: string;
  quizTitle: string;
}

export const generateCertificate = (data: CertificateData): void => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // Set canvas size
  canvas.width = 1200;
  canvas.height = 800;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(0.5, '#e2e8f0');
  gradient.addColorStop(1, '#cbd5e1');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#ff9933';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Inner border
  ctx.strokeStyle = '#228b22';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Title
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 60px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 150);

  // Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '30px Arial, sans-serif';
  ctx.fillText('भारत Quiz Vista', canvas.width / 2, 200);

  // This is to certify text
  ctx.fillStyle = '#374151';
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText('This is to certify that', canvas.width / 2, 280);

  // Name
  ctx.fillStyle = '#ff9933';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText(data.name.toUpperCase(), canvas.width / 2, 340);

  // Has successfully completed
  ctx.fillStyle = '#374151';
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText('has successfully completed the quiz', canvas.width / 2, 390);

  // Quiz details
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillText(`${data.quizTitle} - ${data.location}`, canvas.width / 2, 440);

  // Score
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText(`Score: ${data.score}%`, canvas.width / 2, 500);

  // Date
  ctx.fillStyle = '#64748b';
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText(`Date: ${data.date}`, canvas.width / 2, 580);

  // Signature line
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 300, 680);
  ctx.lineTo(canvas.width - 100, 680);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Platform Administrator', canvas.width - 200, 710);

  // Indian flag colors decoration
  // Saffron
  ctx.fillStyle = '#ff9933';
  ctx.fillRect(100, 60, 80, 20);
  
  // White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(100, 80, 80, 20);
  
  // Green
  ctx.fillStyle = '#228b22';
  ctx.fillRect(100, 100, 80, 20);

  // Right side decoration
  ctx.fillStyle = '#ff9933';
  ctx.fillRect(canvas.width - 180, 60, 80, 20);
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(canvas.width - 180, 80, 80, 20);
  
  ctx.fillStyle = '#228b22';
  ctx.fillRect(canvas.width - 180, 100, 80, 20);

  // Download the certificate
  const link = document.createElement('a');
  link.download = `certificate-${data.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
