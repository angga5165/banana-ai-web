async function predict() {
  const input = document.getElementById("imageInput");
  const result = document.getElementById("result");
  const preview = document.getElementById("preview");

  if (!input.files.length) {
    alert("Upload gambar dulu!");
    return;
  }

  const file = input.files[0];

  // preview image
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  result.innerHTML = "⏳ Memproses gambar...";

  try {
    // CONNECT KE HUGGING FACE SPACE
    const client = await window.gradioClient(
      "https://yogssss-projek-akhir.hf.space"
    );

    // PANGGIL FUNCTION PERTAMA (fn index 0)
    const response = await client.predict(0, {
      image_input: file
    });

    // response.data sesuai return classify_image()
    const text = response.data[0];
    const confidence = response.data[1];

    result.innerHTML = `
      <h3>✅ Hasil Prediksi</h3>
      <p><b>${text}</b></p>
      <pre>${JSON.stringify(confidence, null, 2)}</pre>
    `;
  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Gagal memproses gambar";
  }
}
