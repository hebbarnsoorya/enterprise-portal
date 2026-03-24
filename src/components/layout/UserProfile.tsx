
// UserProfile.tsx
export const UserProfile = () => (
  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">JD</div>
    <span className="text-sm font-medium hidden lg:block">John Doe</span>
  </div>
);