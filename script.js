async function predict() {
  const input = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");
  const previewDiv = document.getElementById("preview");

  if (!input.files.length) {
    alert("Upload gambar dulu!");
    return;
  }

  const file = input.files[0];

  // preview gambar
  previewDiv.innerHTML = `<img src="${URL.createObjectURL(file)}">`;
  resultDiv.innerHTML = "⏳ Memproses...";

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const base64Image = reader.result;

    try {
      const response = await fetch(
        "https://yogssss-projek-akhir.hf.space/run/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [base64Image]
          })
        }
      );

      const result = await response.json();

      const label = result.data[0];
      const confidence = result.data[1];

      resultDiv.innerHTML = `
        <h3>✅ Hasil Prediksi</h3>
        <p><b>${label}</b></p>
        <pre>${JSON.stringify(confidence, null, 2)}</pre>
      `;
    } catch (err) {
      resultDiv.innerHTML = "❌ Gagal memproses gambar";
      console.error(err);
    }
  };
}
