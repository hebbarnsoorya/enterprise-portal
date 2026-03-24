import  UserManagementPage  from '@/features/tables/UserManagementPage';

export default function Page() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">User Management3</h1>
      </header>
      <UserManagementPage />
    </div>
  );
}