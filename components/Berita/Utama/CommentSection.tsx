import React, { useState } from "react";

const CommentSection = () => {
  const [commentText, setCommentText] = useState("");
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    // Simulasi kirim komentar
    console.log("Comment Submitted: ", {
      name,
      nip,
      email,
      commentText,
      rating,
    });
    // Reset form (opsional)
    setName("");
    setNip("");
    setEmail("");
    setCommentText("");
    setRating(0);
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl mt-8 shadow-md">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">Komentar</h2>

      {/* Daftar Komentar */}
      <div className="space-y-6 mb-12">
        <article className="flex items-start bg-white p-5 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex-shrink-0">
            <img
              src="path_to_avatar_image"
              alt="User Avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          <div className="ml-5 flex-1">
            <header className="flex items-center text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">Jon Kantner</span>
              <time className="ml-4 text-gray-400">26 Februari 2025</time>
            </header>
            <p className="mt-3 text-gray-700 leading-relaxed">
              When You Are Ready To Indulge Your Sense Of Excitement, Check Out
              The Range Of Water-Sports Opportunities...
            </p>
          </div>
        </article>
        {/* Tambahkan komentar lain disini */}
      </div>

      {/* Form Tambah Komentar */}
      <div className="bg-white p-7 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Tambahkan Komentar
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Nama */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-gray-700 font-medium"
            >
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* NIP */}
          <div>
            <label
              htmlFor="nip"
              className="block mb-2 text-gray-700 font-medium"
            >
              NIP
            </label>
            <input
              id="nip"
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="NIP"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-gray-700 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Komentar */}
          <div>
            <label
              htmlFor="commentText"
              className="block mb-2 text-gray-700 font-medium"
            >
              Komentar
            </label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis Komentar Disini..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Nilai Kegunaan Artikel:
            </label>
            <div className="flex space-x-3 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  aria-label={`Beri rating ${star} bintang`}
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-300 ${
                    rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Kirim */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Kirim Komentar
          </button>
        </form>
      </div>
    </section>
  );
};

export default CommentSection;
