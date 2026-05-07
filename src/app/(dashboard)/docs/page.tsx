import  DocsManagementPage  from '@/features/doc-reader-remote/DocsManagementPage';
import DocsManagementPageFromServerDocx from '@/features/docx-rw-server/DocsManagementPageFromServerDocx';
import DocsManagementPageGDOCVIEWER from '@/features/doc-reader-remote/DocsManagementPageGDOCVIEWER';
import DocsManagementPageGDOCVIEWERDocx from '@/features/doc-reader-remote/DocsManagementPageGDOCVIEWERDocx';
import DocsManagementPageHTMLEditor from '@/features/doc-reader-remote/DocsManagementPageHTMLEditor';
import  DocsManagementPageWithEditPopup  from '@/features/doc-reader-remote/DocsManagementPageWithEditPopup';

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

         <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - HTML-EDITOR </h1>
      </header>
      <DocsManagementPageHTMLEditor />
    </div>
  );
}