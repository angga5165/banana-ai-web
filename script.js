const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const resultDiv = document.getElementById("result");
const predictBtn = document.getElementById("predictBtn");

let selectedFile = null;

// Preview gambar
imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];

  if (selectedFile) {
    preview.src = URL.createObjectURL(selectedFile);
    preview.style.display = "block";
    resultDiv.innerHTML = "";
  }
});

predictBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Upload gambar dulu!");
    return;
  }

  resultDiv.innerHTML = "⏳ Memproses gambar...";

  try {
    // 🔥 CONNECT KE HUGGING FACE SPACE
    const client = await window.gradioClient(
      "yogssss-projek-akhir"
    );

    // 🔥 PANGGIL FUNCTION PERTAMA (fn=classify_image)
    const result = await client.predict(0, {
      image: selectedFile
    });

    // Output sesuai app.py:
    // return custom_message, confidences
    const predictionText = result.data[0];
    const confidence = result.data[1];

    resultDiv.innerHTML = `
      <h3>✅ Hasil Prediksi</h3>
      <p><b>${predictionText}</b></p>
      <pre>${JSON.stringify(confidence, null, 2)}</pre>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Gagal memproses gambar";
  }
});
