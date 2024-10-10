const form    = document.querySelector('form');
// const email   = document.getElementById('email');
const amount  = document.getElementById('amount');
const rate    = document.getElementById('rate');
const tenure  = document.getElementById('tenure');

const resultTable   = document.getElementById('result-table');
const resultSection = document.getElementById('result-section');


// check when the form is submmitted
form.addEventListener('submit',function(evt){
    evt.preventDefault();
    evt.stopPropagation();
    // user_email = email.value.trim();
    sAmount    = Number(amount.value.trim());
    R          = Number(rate.value.trim());
    T          = Number(tenure.value.trim());


    Loan_amount      = (sAmount * 0.4 * T)/( 1 + R*T/100);
    monthly_payment  = (Loan_amount * ( 1 + R*T/100) )/T;
    Tpa = monthly_payment * T;
    Tpi = Tpa - Loan_amount

    // Get today's date
    let today          = new Date();
    let paymentDueDate = new Date(today);
    
    // Clear previous results
    resultTable.innerHTML = '';

    // Display results in a table
    let output = `
        <tr>
            <th>Month</th>
            <th>Payment Due Date</th>
            <th>Monthly Payment</th>
            <th>Remaining Balance</th>
        </tr>
    `;

    let remainingBalance = Loan_amount;

    for (let i = 1; i <= T; i++) {
        paymentDueDate.setMonth(paymentDueDate.getMonth() + 1); 
        
        output += `
            <tr>
                <td>${i}</td>
                <td>${paymentDueDate.toDateString()}</td>
                <td>${monthly_payment.toLocaleString()}</td>
                <td>${remainingBalance.toLocaleString()}</td>
            </tr>
        `;
        
        remainingBalance -= monthly_payment;
    }

    // Add total payable and interest
    output += `
        <tr class="foot">
            <td colspan="2"><strong>Loanable Amount </strong></td>
            <td colspan="2" style="background-color:#dc288b; color:#fff; font-weight:900">${Loan_amount.toLocaleString()}</td>
        </tr>
        <tr class="foot">
            <td colspan="2"><strong>Total Payable Amount</strong></td>
            <td colspan="2">${Tpa.toLocaleString()}</td>
        </tr>
        <tr class="foot">
            <td colspan="2"><strong>Total Payable Interest</strong></td>
            <td colspan="2">${Tpi.toLocaleString()}</td>
        </tr>
    `;

    resultTable.innerHTML = output;
    resultSection.style.display = 'block'; // Show result section
});



 // Code to generate and download the table as PDF
 document.getElementById('download-pdf').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Loan Payment Schedule", 14, 16);

  // Extracting the table data
  doc.autoTable({
      html: '#result-table',
      startY: 20,
      theme: 'grid',
      headStyles: {
          fillColor: [200, 150, 136],
      },
      styles: {
          fontSize: 10,
          cellPadding: 2,
      }
  });

  doc.save('loan_payment_schedule.pdf');
});