// import { useState } from "react";
// import satker from "./satker";

// const StrukturOrganisasi = () => {
//   const [provinsi, setProvinsi] = useState<string>("");
//   const [kabupaten, setKabupaten] = useState<string>("");
//   const [bagian, setBagian] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const provinsiData = provinsi
//     ? satker.bpsProvinsi[provinsi as keyof typeof satker.bpsProvinsi]
//     : null;
//   const kabupatenData = provinsiData?.kabupatenKota ?? [];
//   const bagianData = provinsiData?.pegawai ?? {};

//   const handleSelectProvinsi = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedProvinsi = e.target.value;
//     if (!selectedProvinsi) {
//       setError("Provinsi harus dipilih!");
//       return;
//     }
//     setError("");
//     setProvinsi(selectedProvinsi);
//     setKabupaten("");
//     setBagian("");
//   };

//   const handleSelectKabupaten = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setKabupaten(e.target.value);
//   };

//   // const handleSelectBagian = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   //   setBagian(e.target.value);
//   // };

//   return (
//     <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
//       {/* Bagian Kiri: Dropdown & Informasi */}
//       <div className="md:w-1/3 bg-gray-100 rounded-lg p-6 shadow-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">
//           Struktur Organisasi BPS
//         </h2>

//         {/* Dropdown Pilih Provinsi */}
//         <div className="mb-5">
//           <label
//             htmlFor="provinsi"
//             className="block mb-1 font-medium text-gray-700"
//           >
//             Provinsi:
//           </label>
//           <select
//             id="provinsi"
//             value={provinsi}
//             onChange={handleSelectProvinsi}
//             className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="" disabled>
//               Pilih Provinsi
//             </option>
//             {Object.keys(satker.bpsProvinsi).map((prov) => (
//               <option key={prov} value={prov}>
//                 {prov}
//               </option>
//             ))}
//           </select>
//           {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
//         </div>

//         {/* Dropdown Pilih Kabupaten/Kota */}
//         {provinsiData && kabupatenData.length > 0 && (
//           <div className="mb-5">
//             <label
//               htmlFor="kabupaten"
//               className="block mb-1 font-medium text-gray-700"
//             >
//               Kabupaten/Kota:
//             </label>
//             <select
//               id="kabupaten"
//               value={kabupaten}
//               onChange={handleSelectKabupaten}
//               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" disabled>
//                 Pilih Kabupaten/Kota
//               </option>
//               {kabupatenData.map((kab) => (
//                 <option key={kab} value={kab}>
//                   {kab}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Informasi Satker */}
//         {provinsiData && (
//           <div className="bg-white p-4 rounded-md shadow-inner mt-6">
//             <h3 className="text-xl font-semibold mb-3">Informasi {provinsi}</h3>
//             <p className="mb-1">
//               <strong>Alamat:</strong> {provinsiData.alamat}
//             </p>
//             <p className="mb-1">
//               <strong>Telepon:</strong>{" "}
//               {provinsiData.telepon || "Tidak tersedia"}
//             </p>
//             {provinsiData.email && (
//               <p className="mb-1">
//                 <strong>Email:</strong>{" "}
//                 <a
//                   href={`mailto:${provinsiData.email}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   {provinsiData.email}
//                 </a>
//               </p>
//             )}
//             {provinsiData.website && (
//               <p>
//                 <strong>Website:</strong>{" "}
//                 <a
//                   href={provinsiData.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   {provinsiData.website}
//                 </a>
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Bagian Kanan: Pejabat & Pegawai */}
//       <div className="md:w-2/3 bg-white rounded-lg p-6 shadow-md overflow-auto max-h-[600px]">
//         {/* Pejabat BPS */}
//         {provinsiData?.pejabat && provinsiData.pejabat.length > 0 && (
//           <section className="mb-6">
//             <h4 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
//               Pejabat BPS
//             </h4>
//             <ul className="list-disc list-inside space-y-2 max-h-40 overflow-y-auto">
//               {provinsiData.pejabat.map((pejabat, index) => (
//                 <li key={index} className="text-gray-700">
//                   <span className="font-semibold">{pejabat.nama}</span> -{" "}
//                   {pejabat.jabatan}{" "}
//                   {pejabat.nip && (
//                     <span className="text-gray-500">(NIP: {pejabat.nip})</span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         {/* Pegawai Berdasarkan Bagian */}
//         {bagian && bagianData[bagian]?.length > 0 && (
//           <section className="mb-6">
//             <h4 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
//               Pegawai di Bagian {bagian}
//             </h4>
//             <ul className="list-disc list-inside space-y-2 max-h-48 overflow-y-auto">
//               {bagianData[bagian].map((pegawai, index) => (
//                 <li key={index} className="text-gray-700">
//                   <span className="font-semibold">{pegawai.nama}</span> -{" "}
//                   {pegawai.jabatan}{" "}
//                   {pegawai.nip && (
//                     <span className="text-gray-500">(NIP: {pegawai.nip})</span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         {/* Menampilkan Semua Pegawai Jika Tidak Ada Bagian Terpilih */}
//         {provinsiData && Object.keys(bagianData).length > 0 && !bagian && (
//           <section>
//             <h4 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
//               Semua Pegawai
//             </h4>
//             <div className="space-y-6 max-h-[400px] overflow-y-auto">
//               {Object.entries(bagianData).map(([bagianKey, pegawaiList]) => (
//                 <div key={bagianKey}>
//                   <h5 className="font-semibold text-lg mb-2">{bagianKey}</h5>
//                   <ul className="list-disc list-inside space-y-1">
//                     {pegawaiList.map((pegawai, index) => (
//                       <li key={index} className="text-gray-700">
//                         <span className="font-semibold">{pegawai.nama}</span> -{" "}
//                         {pegawai.jabatan}{" "}
//                         {pegawai.nip && (
//                           <span className="text-gray-500">
//                             (NIP: {pegawai.nip})
//                           </span>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Jika Tidak Ada Data */}
//         {provinsi && !provinsiData && (
//           <p className="text-red-600 text-center mt-6 font-semibold">
//             Data tidak ditemukan untuk provinsi ini.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StrukturOrganisasi;
