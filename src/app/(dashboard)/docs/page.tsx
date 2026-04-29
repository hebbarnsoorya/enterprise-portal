import  DocsManagementPage  from '@/features/word/DocsManagementPage';
import DocsManagementPageGDOCVIEWER from '@/features/word/DocsManagementPageGDOCVIEWER';
import DocsManagementPageGDOCVIEWERDocx from '@/features/word/DocsManagementPageGDOCVIEWERDocx';
import  DocsManagementPageWithEditPopup  from '@/features/word/DocsManagementPageWithEditPopup';

export default function Page() {
  return (
    <div className="space-y-4">
    

      <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page  - WITH EDIT POPUP </h1>
      </header>

      <DocsManagementPageWithEditPopup />

        <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - DOCUMENT VIEWER </h1>
      </header>
      <DocsManagementPage />

      
        <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - GOOGLE DOCUMENT VIEWER </h1>
      </header>
      <DocsManagementPageGDOCVIEWER />

        <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - GOOGLE .DOCX VIEWER (Error- TO BE FIXED) </h1>
      </header>
      <DocsManagementPageGDOCVIEWERDocx />

      
    </div>
  );
}