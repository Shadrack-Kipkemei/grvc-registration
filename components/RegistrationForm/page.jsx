import { useState } from 'react';
import ChurchSelector from '../ChurchSelector/page';
import ParticipantForm from '../ParticipantForm/page';


export default function RegistrationForm({ meetingData }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        station: '',
        district: '',
        church: '',
        leaderName: '',
        leaderPhone: '',
        attendees: [{ name: '', age: ''}]
    });

    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    // Handle form data changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle attendee data changes
    const handleAttendeeChange = (index, field, value) => {
        const updatedAttendees = [...formData.attendees];
        updatedAttendees[index][field] = value;
        setFormData(prev => ({ ...prev, attendees: updatedAttendees }));
    };

    // Add a new attendee
    const addAttendee = () => {
        setFormData(prev => ({
            ...prev,
            attendees: [...prev.attendees, { name: '', age: '' }]
        }));
    };

    // Remove an attendee
    const removeAttendee = (index) => {
        if (formData.attendees.length > 1) {
            const updatedAttendees = [...formData.attendees];
            updatedAttendees.splice(index, 1);
            setFormData(prev => ({ ...prev, attendees: updatedAttendees }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form  
        if (!formData.station || !formData.district || !formData.church || !formData.leaderName || !formData.leaderPhone) {
            alert('Please fill all required fields');
            return;
        }
        for (let i = 0; i < formData.attendees.length; i++) {
            if (!formData.attendees[i].name || !formData.attendees[i].age) {
                alert(`Please fill all details for the attendee ${i + 1}`);
                return;
            }
        }
        try {
            // Send data to backend
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    ...formData,
                    meeting: meetingData.title,
                    amount: meetingData.registrationAmount * formData.attendees.length
                }),
            });
            if (response.ok) {
                const result = await response.json();
                setInvoiceData(result.invoice);
                setRegistrationComplete(true);

                // Initiate M-Pesa payment
                initiateMpesaPayment(result.invoice);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'Registration failed. Please try again.');
        }
    };

    // Initiate M-Pesa payment
    const initiateMpesaPayment = (invoice) => {
        // This would intergrate with your M-Pesa API
        console.log('Initiating M-Pesa payment for invoice:', invoice);
        // In a real implementation, this would call the backend to initiate payment
        alert(`Please complete payment via M-Pesa. Paybill: 123456, Account: ${invoice.invoiceNumber}, Amount: KES ${invoice.amount}`);
    };

    if (registrationComplete) {
        return (
            <div className="bg-green-100 p-6 rounded-md mt-6 text-center">
                <h2 className="text-2xl font-bold text-green-800">Registration Submitted Successfully!</h2>
                <p className="mt-2">An invoice has been generated and sent to your phone number.</p>
                <p className="mt-2">Please complete the M-Pesa payment to confirm your registration.</p>
                {invoiceData && (
                    <div className="bg-white p-4 rounded-md mt-4 max-w-md mx-auto text-left">
                        <h3 className="text-lg font-bold mb-2">Invoice Details</h3>
                        <p>Invoice Number: {invoiceData.invoiceNumber}</p>
                        <p>Total Amount: KES {invoiceData.amount}</p>
                        <p>Paybill: 123456</p>
                        <p>Account Number: {invoiceData.accountNumber}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-6 rounded-md mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Form</h2>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <ChurchSelector
                        formData={formData}
                        onInputChange={handleInputChange}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <ParticipantForm
                        formData={formData}
                        onAttendeeChange={handleAttendeeChange}
                        onAddAttendee={addAttendee}
                        onRemoveAttendee={removeAttendee}
                        onBack={() => setStep(1)}
                        meetingData={meetingData}
                        onSubmit={handleSubmit}
                    />
                )}
            </form>
        </div>
    );
}