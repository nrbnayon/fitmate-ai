// // utils/exportUtils.ts
// import { LandParcel } from "@/types/land-parcel";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import ExcelJS from "exceljs";

// export const exportToPDF = (
//   data: LandParcel[],
//   filename: string = "land_parcels.pdf"
// ) => {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("Land Parcels Report", 14, 22);

//   doc.setFontSize(11);
//   doc.setTextColor(100);
//   doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

//   const tableColumn = [
//     "Parcel ID",
//     "Owner Name",
//     "Area (m²)",
//     "Zone",
//     "Type",
//     "Ownership",
//     "Registration Date",
//   ];
//   const tableRows = data.map((parcel) => [
//     parcel.parcelId,
//     parcel.ownerName,
//     `${parcel.area.toLocaleString()} m²`,
//     parcel.zone,
//     parcel.type,
//     parcel.ownership,
//     parcel.registrationDate,
//   ]);

//   autoTable(doc, {
//     head: [tableColumn],
//     body: tableRows,
//     startY: 40,
//     theme: "grid",
//     headStyles: {
//       fillColor: [73, 171, 65],
//       textColor: 255,
//       fontStyle: "bold",
//     },
//     alternateRowStyles: {
//       fillColor: [245, 245, 245],
//     },
//     margin: { top: 40 },
//   });

//   doc.save(filename);
// };

// export const exportToCSV = (
//   data: LandParcel[],
//   filename: string = "land_parcels.csv"
// ) => {
//   const headers = [
//     "Parcel ID",
//     "Owner Name",
//     "Area (m²)",
//     "Zone",
//     "Type",
//     "Ownership",
//     "Registration Date",
//   ];

//   const csvContent = [
//     headers.join(","),
//     ...data.map((parcel) =>
//       [
//         parcel.parcelId,
//         `"${parcel.ownerName}"`,
//         parcel.area,
//         parcel.zone,
//         parcel.type,
//         parcel.ownership,
//         parcel.registrationDate,
//       ].join(",")
//     ),
//   ].join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);

//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const exportToExcel = async (
//   data: LandParcel[],
//   filename: string = "land_parcels.xlsx"
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Land Parcels");

//   // Set column headers with styling
//   worksheet.columns = [
//     { header: "Parcel ID", key: "parcelId", width: 15 },
//     { header: "Owner Name", key: "ownerName", width: 25 },
//     { header: "Area (m²)", key: "area", width: 15 },
//     { header: "Zone", key: "zone", width: 12 },
//     { header: "Type", key: "type", width: 15 },
//     { header: "Ownership", key: "ownership", width: 15 },
//     { header: "Registration Date", key: "registrationDate", width: 20 },
//   ];

//   // Style the header row
//   worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
//   worksheet.getRow(1).fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FF49AB41" },
//   };
//   worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

//   // Add data rows
//   data.forEach((parcel) => {
//     worksheet.addRow({
//       parcelId: parcel.parcelId,
//       ownerName: parcel.ownerName,
//       area: parcel.area,
//       zone: parcel.zone,
//       type: parcel.type,
//       ownership: parcel.ownership,
//       registrationDate: parcel.registrationDate,
//     });
//   });

//   // Apply alternating row colors
//   worksheet.eachRow((row, rowNumber) => {
//     if (rowNumber > 1 && rowNumber % 2 === 0) {
//       row.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFF5F5F5" },
//       };
//     }
//   });

//   // Generate buffer and download
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);

//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };
