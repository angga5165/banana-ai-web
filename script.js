let client;

async function init() {
  client = await window.gradioClient(
    "https://yogssss-projek-akhir.hf.space"
  );
}

init();

async function predict() {
  const input = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");

  if (!input.files.length) {
    alert("Upload gambar dulu!");
    return;
  }

  resultDiv.innerHTML = "⏳ Memproses...";

  try {
    const result = await client.predict(
      "/predict", // otomatis sesuai Gradio
      [input.files[0]]
    );

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
}
