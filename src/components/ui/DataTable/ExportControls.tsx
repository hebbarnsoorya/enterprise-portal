"use client";
import { Table } from '@tanstack/react-table'; // Add this import
import { Printer, FileSpreadsheet } from 'lucide-react'; //laptop

import React from 'react';
import { 
  Download, FileText, Table as TableIcon, 
  FileJson, FileCode, ChevronDown, FileStack 
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import 'jspdf-autotable'; // <--- FIX#240326P1015: Critical plugin attachment
import autoTable from 'jspdf-autotable';

interface ExportProps<TData> {
  data: TData[];
  table: Table<TData>; // Fixes Error: Property 'table' does not exist
  fileName?: string;
}

export const ExportControls = <TData,>({ 
  data, 
  table, 
  fileName = "Enterprise_Report" 
}: ExportProps<TData>) => {
  
  // High Standard: Export only what the user sees (filtered data) 
  // or everything if no filters are applied
  const prepareData = () => {
    const rows = table.getFilteredRowModel().rows;
    return rows.map(row => row.original);
  };


  const exportToExcel = () => {
    const exportData = prepareData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const exportToPDF = () => {
    // 1. Initialize jsPDF (p = portrait, pt = points, a4 = paper size)
    const doc = new jsPDF('p', 'pt', 'a4');

    // 2. Prepare Columns & Rows
    const visibleColumns = table.getVisibleLeafColumns()
      .filter(col => col.id !== 'select' && col.id !== 'actions');
      
    const tableHeaders = visibleColumns.map(col => 
      String(col.columnDef.header || col.id)
    );
    
    const tableRows = data.map(row => 
      visibleColumns.map(col => {
        const value = (row as any)[col.id];
        return value === null || value === undefined ? '' : String(value);
      })
    );

    // 3. THE FIX: Using the function directly with explicit options
    const options: UserOptions = {
      head: [tableHeaders],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] }, // Slate-800 "Cool & Calm"
      styles: { fontSize: 8, cellPadding: 3 },
    };

    // Call the imported function passing the doc instance
    autoTable(doc, options);

    doc.save(`export_${new Date().getTime()}.pdf`);
  };

  const exportToPDFWithHeader = () => {
  // 1. Initialize jsPDF (Points 'pt', A4 size)
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // 2. BRANDING & HEADER SECTION
  // Set Title
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text("User Management Report", 40, 50);

  // Set Metadata (Date/Time)
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  const reportDate = new Date().toLocaleString();
  doc.text(`Generated on: ${reportDate}`, 40, 65);

  // Draw a horizontal divider line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(40, 75, pageWidth - 40, 75);

  // 3. PREPARE TABLE DATA (TanStack Integration)
  const visibleColumns = table.getVisibleLeafColumns()
    .filter(col => col.id !== 'select' && col.id !== 'actions');
    
  const tableHeaders = visibleColumns.map(col => 
    String(col.columnDef.header || col.id)
  );
  
  const tableRows = data.map(row => 
    visibleColumns.map(col => {
      const value = (row as any)[col.id];
      return value === null || value === undefined ? '' : String(value);
    })
  );

  // 4. GENERATE TABLE (Starting below the header)
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: 95, // Positioned after the header/line
    theme: 'striped',
    headStyles: { 
      fillColor: [59, 130, 246], // Primary Blue-500 for a fresh look
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 9, 
      cellPadding: 6,
      lineColor: [241, 245, 249],
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Very light slate for "Cool & Calm"
    },
    // Add Page Numbers
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 60,
        doc.internal.pageSize.getHeight() - 20
      );
    }
  });

  doc.save(`User_Report_${new Date().getTime()}.pdf`);
};

  const exportToCSV = () => {
    const sourceData = prepareData().length > 0 ? prepareData() : [];
    const headers = Object.keys(sourceData[0] as object).join(",");
    const rows = sourceData.map(obj => Object.values(obj as object).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  };

  {/* NOT in USE . but working fine*/}
const downloadCSV = () => {
    // 1. Get ONLY the visible columns from TanStack state
    const visibleColumns = table.getVisibleLeafColumns();
    
    // 2. Create Header Row (CSV Column Names)
    const headers = visibleColumns
      .map(col => col.id || (col.columnDef.header as string))
      .filter(header => header !== 'select' && header !== 'actions'); // Skip UI-only columns

    // 3. Create Data Rows
    const csvRows = data.map(row => {
      return headers.map(header => {
        // Find the column that matches this header
        const column = visibleColumns.find(col => col.id === header || col.columnDef.header === header);
        if (!column) return '';
        
        // Extract value (handling nested objects if necessary)
        const value = (row as any)[column.id];
        const stringValue = value === null || value === undefined ? '' : String(value);
        
        // Escape quotes for CSV safety
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',');
    });

    // 4. Combine Headers and Rows
    const csvString = [headers.join(','), ...csvRows].join('\n');

    // 5. Trigger Browser Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `export_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToDocx = () => {
    // Standard Enterprise trick: HTML-based DOCX export
    const sourceData = prepareData();
    const header = Object.keys(sourceData[0] as object).map(h => `<th style="border:1px solid black">${h}</th>`).join("");
    const rows = sourceData.map(row => 
      `<tr>${Object.values(row as object).map(v => `<td style="border:1px solid black">${v}</td>`).join("")}</tr>`
    ).join("");
    
    const content = `<table style="border-collapse:collapse">${header}${rows}</table>`;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    saveAs(blob, `${fileName}.doc`);
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `${fileName}.json`);
  };

  // Bonus: Print-friendly view

  const handlePrint = (printType: 'all' | 'current') => {
  const headers = table.getVisibleLeafColumns()
    .filter(col => col.id !== 'select' && col.id !== 'actions')
    .map(col => col.columnDef.header as string);

  // FIX: Use getFilteredRowModel() so "Print All" respects your search query
  const rows = printType === 'all' 
    ? table.getFilteredRowModel().rows // Respects Search + Filters
    : table.getRowModel().rows;         // Current Page only

  const printableData = rows.map(row => {
    return table.getVisibleLeafColumns()
      .filter(col => col.id !== 'select' && col.id !== 'actions')
      .map(col => {
        const cell = row.getVisibleCells().find(c => c.column.id === col.id);
        return cell ? cell.getContext().getValue() : '';
      });
  });

  generatePrintWindow(headers, printableData, printType);
};

/*
  const handlePrint = (printType: 'all' | 'current') => {
    // 1. Get Selected (Visible) Column Headers
    const headers = table.getVisibleLeafColumns()
      .filter(col => col.id !== 'select' && col.id !== 'actions')
      .map(col => col.columnDef.header as string);

    // 2. Get Data based on printType
    const rows = printType === 'all' 
      ? table.getCoreRowModel().rows // All pages
      : table.getRowModel().rows;    // Current page only

    // 3. Map row data to visible columns only
    const printableData = rows.map(row => {
      return table.getVisibleLeafColumns()
        .filter(col => col.id !== 'select' && col.id !== 'actions')
        .map(col => {
          const cell = row.getVisibleCells().find(c => c.column.id === col.id);
          return cell ? cell.getContext().getValue() : '';
        });
    });

    generatePrintWindow(headers, printableData, printType);
  };
*/

  const generatePrintWindow = (headers: string[], body: any[][], type: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Print Report - ${type === 'all' ? 'Entire Data' : 'Current Page'}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${fileName}</h2>
            <p>Report Type: ${type === 'all' ? 'Full Dataset' : 'Current Page Data'}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
          <div class="footer">Confidential Enterprise Report - Page 1 of 1</div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };


  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
          <Download size={18} className="group-hover:bounce" />
          <span>Export Options</span>
          <ChevronDown size={14} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-[220px] bg-white rounded-xl p-2 shadow-2xl border border-slate-100 z-[100] animate-in fade-in zoom-in-95 duration-200"
          sideOffset={8}
        >
             <div className="h-px bg-slate-100 my-2" />
          
          {/* A#1: Print Options */}
          <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Print</div>
          
          <DropdownMenu.Item 
            onClick={() => handlePrint('all')}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 outline-none cursor-pointer hover:bg-slate-50 rounded-lg"
          >
            <Printer size={16} className="text-slate-500" />
            <div className="flex flex-col">
              <span className="font-medium">Print All Pages</span>
              <span className="text-[10px] text-slate-400">Selected columns only</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item 
            onClick={() => handlePrint('current')}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 outline-none cursor-pointer hover:bg-slate-50 rounded-lg"
          >
            <Printer size={16} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="font-medium">Print Current View</span>
              <span className="text-[10px] text-slate-400">Current page + Selected columns</span>
            </div>
          </DropdownMenu.Item>


          <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Spreadsheets</div>
          <DropdownItem onClick={exportToExcel} icon={<TableIcon size={16}/>} label="Microsoft Excel" ext=".xlsx" color="text-emerald-600" />
          <DropdownItem onClick={exportToCSV} icon={<FileCode size={16}/>} label="CSV UTF-8" ext=".csv" color="text-blue-500" />
          

{/* Download CSV 
        <DropdownItem 
            onClick={downloadCSV}
           icon={<FileCode size={16}/>} label="DownloadCSV UTF-8" ext=".csv" color="text-blue-500" />
            
*/}


          <div className="h-px bg-slate-100 my-2" />
          <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Documents</div>
          <DropdownItem onClick={exportToPDF} icon={<FileText size={16}/>} label="PDF Document" ext=".pdf" color="text-rose-500" />
          <DropdownItem onClick={exportToPDFWithHeader} icon={<FileText size={16}/>} label="Header PDF Document" ext=".pdf" color="text-rose-500" />
          <DropdownItem onClick={exportToDocx} icon={<FileStack size={16}/>} label="Word Document" ext=".doc" color="text-indigo-600" />
          
          <div className="h-px bg-slate-100 my-2" />
          <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Developer</div>
          <DropdownItem onClick={exportToJSON} icon={<FileJson size={16}/>} label="Raw JSON" ext=".json" color="text-amber-500" />

          
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const DropdownItem = ({ onClick, icon, label, ext, color }: any) => (
  <DropdownMenu.Item 
    onClick={onClick}
    className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 outline-none cursor-pointer hover:bg-slate-50 rounded-lg transition-colors group"
  >
    <div className="flex items-center gap-3">
      <span className={`${color} transition-transform group-hover:scale-110`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-[10px] font-mono text-slate-400">{ext}</span>
  </DropdownMenu.Item>
);