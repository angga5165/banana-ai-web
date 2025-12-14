import { Client } from "@gradio/client";

const predictBtn = document.getElementById("predictBtn");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");
const previewImg = document.getElementById("preview");

let client;

// connect ke Hugging Face Space
(async () => {
  client = await Client.connect("yogssss-projek-akhir");
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
    const result = await client.predict("/predict", [
      file
    ]);

    const text = result.data[0];
    const confidence = result.data[1];

    resultDiv.innerHTML = `
      <h3>✅ Hasil Prediksi</h3>
      <p><b>${text}</b></p>
      <pre>${JSON.stringify(confidence, null, 2)}</pre>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Gagal memproses gambar";
  }
};
