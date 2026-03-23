// Pre-defined staff accounts
export const initializeStaffAccounts = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if Principal account exists
  const hasPrincipal = users.some((u: any) => u.role === 'principal');
  
  if (!hasPrincipal) {
    // Only create the Principal account - Principal will create other staff accounts
    const principalAccount = {
      id: 'principal-001',
      name: 'Dr. Sarah Johnson',
      email: 'principal@school.edu',
      password: 'principal123',
      role: 'principal',
    };
    
    users.push(principalAccount);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('Principal account initialized:');
    console.log('Email: principal@school.edu');
    console.log('Password: principal123');
    console.log('Use "Manage Staff" to create accounts for teachers, librarian, and office workers.');
  }
};