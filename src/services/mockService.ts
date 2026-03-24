export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}

export const fetchMockDataError = async (): Promise<UserData[]> => {
        () =>  fetchMockData3;
}


export const fetchMockData1 = async (): Promise<UserData[]> => {//1
  // Simulating an API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active', createdAt: '2023-01-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'User', status: 'Active', createdAt: '2023-02-15' },
        { id: '3', name: 'Mike Ross', email: 'mike@company.com', role: 'Manager', status: 'Inactive', createdAt: '2023-03-10' },
        { id: '4', name: 'Rachel Zane', email: 'rachel@company.com', role: 'User', status: 'Pending', createdAt: '2023-05-20' },
        // Add more dummy rows for pagination testing
      ]);
    }, 800);
  });
};


export const fetchMockData = async (): Promise<UserData[]> => {//2
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseData: UserData[] = [
        { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active', createdAt: '2023-01-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'User', status: 'Active', createdAt: '2023-02-15' },
        { id: '3', name: 'Mike Ross', email: 'mike@company.com', role: 'Manager', status: 'Inactive', createdAt: '2023-03-10' },
        { id: '4', name: 'Rachel Zane', email: 'rachel@company.com', role: 'User', status: 'Pending', createdAt: '2023-05-20' },
      ];

      const roles = ['Admin', 'User', 'Manager'];
      const statuses = ['Active', 'Inactive', 'Pending'];

      const generatedData: UserData[] = Array.from({ length: 101 }, (_, i) => {
        const id = i + 5;

        return {
          id: String(id),
          name: `User ${id}`,
          email: `user${id}@company.com`,
          role: roles[i % roles.length],
          status: statuses[i % statuses.length],
          createdAt: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        };
      });

      resolve([...baseData, ...generatedData]);
    }, 800);
  });
};




export const fetchMockData3 = async (): Promise<UserData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateUsers(105));
    }, 800);
  });
};

const generateUsers = (count: number): UserData[] => {
  const roles = ['Admin', 'User', 'Manager'];
  const statuses = ['Active', 'Inactive', 'Pending'];

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;

    return {
      id: String(id),
      name: id === 1 ? 'John Doe'
          : id === 2 ? 'Jane Smith'
          : id === 3 ? 'Mike Ross'
          : id === 4 ? 'Rachel Zane'
          : `User ${id}`,
      email: id <= 4
        ? ['john@company.com', 'jane@company.com', 'mike@company.com', 'rachel@company.com'][i]
        : `user${id}@company.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      createdAt: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    };
  });
};


