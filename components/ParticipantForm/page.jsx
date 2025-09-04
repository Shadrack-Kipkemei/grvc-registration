export default function ParticipantForm({
    formData,
    onAttendeeChange,
    onAddAttendee,
    onRemoveAttendee,
    onBack,
    meetingData,
    onSubmit
}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target; // This function will be passed from parent component
    };

    return (
        <div>
            <h3 className="text-xl font-semifold text-gray-700 mb-4">Step 2: Attendee Information</h3>
            <div className="mb-4">
                <label htmlFor="leaderName" className="block text-sm font-medium text-gray-700 mb-1">Leader Name *</label>
                <input
                    type="text"
                    id="leaderName"
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-700 mb-1">Leader Phone Number *</label>
                <input
                    type="tel"
                    id="leaderPhone"
                    name="leaderPhone"
                    value={formData.leaderPhone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <h4 className="text-lg font-medium text-gray-700 mb-3">Attendees</h4>
            {formData.attendees.map((attendee, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attendee {index + 1} Name *</label>
                            <input
                                type="text"
                                value={attendee.name}
                                onChange={(e) => onAttendeeChange(index, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                            <input
                                type="number"
                                min="1"
                                value={attendee.age}
                                onChange={(e) => onAttendeeChange(index, 'age', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    </div>

                    {formData.attendees.length > 1 && (
                        <button
                            type="button"
                            onClick={() => onRemoveAttendee(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                            >
                            Remove Attendee
                        </button> 
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={onAddAttendee}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mb-6 hover:bg-gray-300"
            >
                + Add Attendee
            </button>

            <div className="bg-green-50 p-4 rounded-md mb-6">
                <h4 className="font-semibold text-green-800">Registration Summary</h4>
                <p>Number of Attendees: {formData.attendees.length}</p>
                <p className="font-bold">Total Amount: KES {meetingData.registrationAmount * formData.attendees.length}</p>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Submit Registration
                </button>    
            </div>
        </div>
    );
}