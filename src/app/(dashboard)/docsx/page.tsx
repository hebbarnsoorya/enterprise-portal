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
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - READ Server DOCX </h1>
      </header>
      <DocsManagementPageFromServerDocx/>
    </div>
  );
}