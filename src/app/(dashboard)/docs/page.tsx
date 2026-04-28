import  DocsManagementPage  from '@/features/word/DocsManagementPage';
import  DocsManagementPageWithEditPopup  from '@/features/word/DocsManagementPageWithEditPopup';

export default function Page() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page - DOCUMENT VIEWER </h1>
      </header>
      <DocsManagementPage />

      <header>
        <h1 className="text-2xl font-bold text-slate-800">Document Management Page  - WITH EDIT POPUP </h1>
      </header>

      <DocsManagementPageWithEditPopup />
    </div>
  );
}