async function predict() {
  const input = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const resultDiv = document.getElementById("result");

  if (!input.files.length) {
    alert("Upload gambar dulu!");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
    // TAMPILKAN PREVIEW
    preview.src = reader.result;
    preview.style.display = "block";

    resultDiv.innerHTML = "⏳ Memproses...";

    try {
      const response = await fetch(
        "https://yogssss-projek-akhir.hf.space/api/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: [reader.result] // ⬅️ PENTING: KIRIM FULL DATA URL
          })
        }
      );

      const data = await response.json();

      if (!data.data) {
        throw new Error("Format response salah");
      }

      const predictionText = data.data[0];
      const confidence = data.data[1];

      resultDiv.innerHTML = `
        <h3>✅ Hasil Prediksi</h3>
        <p><b>${predictionText}</b></p>
        <pre>${JSON.stringify(confidence, null, 2)}</pre>
      `;
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = "❌ Gagal memproses gambar";
    }
  };

  reader.readAsDataURL(file);
}
