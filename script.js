import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/+esm";

const predictBtn = document.getElementById("predictBtn");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");
const previewImg = document.getElementById("preview");

let client;

// connect ke Hugging Face Space
// Initial State
predictBtn.disabled = true;
predictBtn.innerText = "⏳ Menghubungkan ke Server...";

// connect ke Hugging Face Space
(async () => {
  try {
    client = await Client.connect("Yogssss/Projek-Akhir");

    // Sukses connect
    predictBtn.disabled = false;
    predictBtn.innerText = "Prediksi";
    console.log("Terhubung ke Hugging Face Space!");

    // Debug: Cek nama endpoint API
    const apiInfo = await client.view_api();
    console.log("API Info:", apiInfo);
  } catch (error) {
    console.error("Gagal connect:", error);
    predictBtn.innerText = "❌ Gagal Terhubung";
    resultDiv.innerHTML = `<p style="color:red">Gagal terhubung ke server AI. Coba refresh halaman.</p>`;
  }
})();

predictBtn.onclick = async () => {
  if (!imageInput.files.length) {
    alert("Upload gambar dulu!");
    return;
  }

  const file = imageInput.files[0];

  // preview image
  previewImg.src = URL.createObjectURL(file);
  previewImg.style.display = "block";

  resultDiv.innerHTML = "⏳ Memproses...";

  try {
    const result = await client.predict("/classify_image", [
      file
    ]);

    // --- PARSE HASIL ---
    // result.data[0] = String pesan
    // result.data[1] = Object { label: "...", confidences: [{label: "...", confidence: 0.9}, ...] }

    const outputObject = result.data[1];
    const confidences = outputObject.confidences;

    // Cari persentase masing-masing
    // Label mungkin "Banana_Healthy" dan "Banana_Rotten" atau varian lain
    // Kita cari yang mengandung kata "healthy" atau "rotten" (case insensitive)

    let healthyScore = 0;
    let rottenScore = 0;

    confidences.forEach(item => {
      const lbl = item.label.toLowerCase();
      if (lbl.includes("healthy")) {
        healthyScore = item.confidence;
      } else if (lbl.includes("rotten")) {
        rottenScore = item.confidence;
      }
    });

    // Tentukan Pemenang
    const isHealthy = healthyScore > rottenScore;

    // Config UI
    let statusConfig = {
      className: isHealthy ? "verdict-safe" : "verdict-rotten",
      icon: isHealthy ? "✨" : "🦠",
      title: isHealthy ? "Pisang Sehat & Segar" : "Pisang Busuk / Tak Layak",
      desc: isHealthy
        ? "Aman dan bergizi untuk dikonsumsi anak-anak."
        : "Sebaiknya dibuang, berisiko bagi kesehatan."
    };

    // Format Persentase
    const healthyPercent = (healthyScore * 100).toFixed(1);
    const rottenPercent = (rottenScore * 100).toFixed(1);

    // Render HTML sederhana untuk 2 bar ini
    const confidenceHTML = `
      <div class="confidence-item">
          <div class="bar-label">
              <span>🍌 Pisang Sehat</span>
              <span>${healthyPercent}%</span>
          </div>
          <div class="bar-bg">
              <div class="bar-fill" style="width: ${healthyPercent}%; background-color: #10b981;"></div>
          </div>
      </div>
      <div class="confidence-item">
           <div class="bar-label">
              <span>🦠 Pisang Busuk</span>
              <span>${rottenPercent}%</span>
          </div>
          <div class="bar-bg">
              <div class="bar-fill" style="width: ${rottenPercent}%; background-color: #ef4444;"></div>
          </div>
      </div>
    `;

    resultDiv.innerHTML = `
      <div class="result-card">
        <!-- Main Verdict Header -->
        <div class="main-verdict ${statusConfig.className}">
            <div class="icon">${statusConfig.icon}</div>
            <div class="text">
                <h3>${statusConfig.title}</h3>
                <p>${statusConfig.desc}</p>
            </div>
        </div>

        <!-- Detail Progress Bars -->
        <div class="confidence-list">
            <h4>Analisis AI:</h4>
            ${confidenceHTML}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Gagal memproses gambar";
  }
};
