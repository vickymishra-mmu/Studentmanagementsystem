// Simulated email service
export interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachment?: any;
}

export const sendEmail = (emailData: EmailData): boolean => {
  try {
    console.log('Email sent to:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Body:', emailData.body);
    
    // Store sent emails in localStorage for demonstration
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      ...emailData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const generateBookIssueReceipt = (data: {
  studentName: string;
  rollNo: string;
  email: string;
  bookName: string;
  issueDate: Date;
  returnDate: Date;
}) => {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     LIBRARY BOOK ISSUE RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student Name: ${data.studentName}
Roll Number: ${data.rollNo}
Email: ${data.email}

Book Name: ${data.bookName}
Issue Date: ${data.issueDate.toLocaleDateString()}
Return Date: ${data.returnDate.toLocaleDateString()}

Please return the book on or before the due date.
Late fee: ₹2 per day

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
};

export const generateBookReturnReceipt = (data: {
  studentName: string;
  rollNo: string;
  email: string;
  bookName: string;
  issueDate: Date;
  returnDate: Date;
  actualReturnDate: Date;
  lateFee: number;
}) => {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     LIBRARY BOOK RETURN RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student Name: ${data.studentName}
Roll Number: ${data.rollNo}
Email: ${data.email}

Book Name: ${data.bookName}
Issue Date: ${data.issueDate.toLocaleDateString()}
Due Date: ${data.returnDate.toLocaleDateString()}
Return Date: ${data.actualReturnDate.toLocaleDateString()}

${data.lateFee > 0 ? `Late Fee: ₹${data.lateFee}` : 'Returned on time'}

Thank you for using our library!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
};

export const generateFeeReceipt = (data: {
  studentName: string;
  rollNo: string;
  admissionNo: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  feeAmount: number;
  receiptType: 'regular' | 'late' | 'library_fine';
  lateDays?: number;
}) => {
  const totalAmount = data.receiptType === 'late' 
    ? data.feeAmount + (data.lateDays || 0) * 100
    : data.feeAmount;

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         FEE PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Receipt No: ${Date.now()}
Date: ${new Date().toLocaleDateString()}

Student Name: ${data.studentName}
Admission No: ${data.admissionNo}
Roll Number: ${data.rollNo}
Class: ${data.class} - ${data.section}
Email: ${data.email}
Phone: ${data.phone}

Fee Type: ${data.receiptType === 'regular' ? 'Regular Fee' : data.receiptType === 'late' ? 'Late Fee Payment' : 'Library Fine'}
${data.receiptType === 'late' ? `Late Days: ${data.lateDays}\nLate Fee (₹100/day): ₹${(data.lateDays || 0) * 100}\n` : ''}Base Amount: ₹${data.feeAmount}

TOTAL AMOUNT PAID: ₹${totalAmount}

Payment Status: PAID ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
};
