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
    // result.data[0] = String pesan ("Gambar ini adalah...")
    // result.data[1] = Object Confidences { "Banana_Healthy": 0.9, ... }

    // Ambil dictionary confidence dari data[1]
    const confidencesDict = result.data[1];

    // Convert object ke array dan urutkan dari yang terbesar
    const confidences = Object.entries(confidencesDict)
      .map(([label, confidence]) => ({ label, confidence }))
      .sort((a, b) => b.confidence - a.confidence);

    // Ambil label dengan confidence tertinggi
    const topLabel = confidences[0].label;

    // Tentukan Status (Sehat/Busuk)
    const isHealthy = topLabel.toLowerCase().includes("healthy");
    const isRotten = topLabel.toLowerCase().includes("rotten");

    // Config UI berdasarkan status
    let statusConfig = {
      className: "verdict-neutral",
      icon: "🍌",
      title: "Hasil Tidak Diketahui",
      desc: "Coba gambar lain."
    };

    if (isHealthy) {
      statusConfig = {
        className: "verdict-safe",
        icon: "✨",
        title: "Pisang Sehat & Segar",
        desc: "Aman dan bergizi untuk dikonsumsi anak-anak."
      };
    } else if (isRotten) {
      statusConfig = {
        className: "verdict-rotten",
        icon: "🦠",
        title: "Pisang Busuk / Tak Layak",
        desc: "Sebaiknya dibuang, berisiko bagi kesehatan."
      };
    }

    // --- RENDER UI ---
    let confidenceHTML = confidences.map(item => {
      const percent = (item.confidence * 100).toFixed(1);
      const labelClean = item.label.replace(/_/g, " "); // Hapus underscore
      return `
            <div class="confidence-item">
                <div class="bar-label">
                    <span>${labelClean}</span>
                    <span>${percent}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }).join("");

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
