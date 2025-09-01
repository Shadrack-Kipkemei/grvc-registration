export default function MeetingInfo({ meetingData }) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800">{meetingData.title}</h2>
            <p className="text-lg text-gray-600 mt-2">
                {new Date(meetingData.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mt-4">{meetingData.description}</p>
            <p className="text-lg font-bold text-blue-800 mt-4">
                Registration Fee: KES {meetingData.registrationAmount}
            </p>
        </div>
    );
}