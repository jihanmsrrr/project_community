// 'use client';

// import { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// const data = [
//   {
//     category: 'Poliklinik',
//     items: [
//       { name: 'Poliklinik Umum', id: 1012 },
//       { name: 'Poliklinik Gigi', id: 1013 },
//     ],
//   },
//   {
//     category: 'Paguyuban Pensiun',
//     items: [{ name: 'Sekretariat', id: 1022 }],
//   },
//   {
//     category: 'Koperasi BPS',
//     items: [
//       { name: 'Manager', id: 1019 },
//       { name: 'Unit Tabungan', id: 1020 },
//       { name: 'Unit Toko Buku (Gd. 4 Lt. 1)', id: 7445 },
//       { name: 'Unit Toko Mini', id: 1025 },
//       { name: 'Unit Foto Copy', id: 1026 },
//     ],
//   },
//   {
//     category: 'POSKO',
//     items: [
//       { name: 'Satpam/Gerbang', id: 1111 },
//       { name: 'Teknisi BPS', id: 1010 },
//       { name: 'Teknisi Basement Gd 6', id: 1060 },
//       { name: 'Teknisi Komputer', id: 1515 },
//     ],
//   },
//   {
//     category: 'Ruang Rapat/Dapur',
//     items: [
//       { name: 'Gd 2 Lt 2', id: 1033 },
//       { name: 'Gd 3 Lt 1', id: 1022 },
//       { name: 'Gd 6 Lt 8', id: 1066 },
//     ],
//   },
//   {
//     category: 'Dharma Wanita',
//     items: [{ name: 'Sekretariat', id: 1024 }],
//   },
//   {
//     category: 'Lain-lain',
//     items: [{ name: 'UNICEF', id: 1643 }],
//   },
// ];

// const Accordion = () => {
//   const [openCategory, setOpenCategory] = useState<string | null>(null);

//   const toggleCategory = (category: string) => {
//     setOpenCategory(openCategory === category ? null : category);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4">
//       {data.map(({ category, items }) => (
//         <div key={category} className="mb-2 border-b">
//           <button
//             onClick={() => toggleCategory(category)}
//             className="w-full flex justify-between items-center p-3 text-lg font-semibold text-gray-800 bg-gray-100 rounded-md"
//           >
//             {category}
//             {openCategory === category ? <ChevronUp /> : <ChevronDown />}
//           </button>
//           {openCategory === category && (
//             <ul className="p-3 bg-gray-50 rounded-md">
//               {items.map((item) => (
//                 <li key={item.id} className="py-1 text-gray-700">
//                   {item.name} (ID: {item.id})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Accordion;