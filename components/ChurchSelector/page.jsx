import { useState, useEffect } from 'react';


export default function ChurchSelector({ formData, onInputChange, onNext }) {
    const [stations, setStations] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [churches, setChurches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch stations on component mount
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stations');
                const data = await response.json();
                setStations(data);
            } catch (error) {
                console.error('Error fetching stations:', error);
            }
        };
        fetchStations();
    }, []);

    // Fetch districts when station changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!formData.station) {
                setDistricts([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/stations/${formData.station}/districts`);
                const data = await response.json();
                setDistricts(data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
        fetchDistricts();
    }, [formData.station]);


    // Fetch churches when district changes
    useEffect(() => {
        const fetchChurches = async () => {
            if (!formData.district || !formData.station) {
                setChurches([]);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/stations/${formData.station}/districts/${formData.district}/churches`);
                const data = await response.json();
                setChurches(data);
            } catch (error) {
                console.error('Error fetching churches:', error);
            }
        };
        fetchChurches();
    }, [formData.station, formData.district]);

    const handleNext = () => {
        if (!formData.station || !formData.district || !formData.church)
        {
            alert('Please select a station, district, and church');
            return;
        }
        onNext();
    };

    return (
        <div className="mb-4">
            <h3 className="text-xl font-semifold text-gray-700 mb-4">Step 1: Select Your Church</h3>
            <div className="mb-4">
                <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-1">Station *</label>
                <select
                    id="station"
                    name="station"
                    value={formData.station}
                    onChange={onInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    <option value="">Select Station</option>
                    {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={onInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    disabled={!formData.station}
                >
                    <option value="">Select District</option>
                    {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-1">Church *</label>
                <select
                    id="church"
                    name="church"
                    value={formData.church}
                    onChange={onInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    disabled={!formData.district}
                >
                    <option value="">Select Church</option>
                    {churches.map(church => (
                        <option key={church.id} value={church.id}>{church.name}</option>
                    ))}
                </select>
            </div>

            {formData.station && formData.district && formData.church && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <h4 className="font-semifold text-blue-800">Selection Summary</h4>
                    <p>Station: {stations.find(s => s.id == formData.station)?.name}</p>
                    <p>District: {districts.find(d => d.id == formData.district)?.name}</p>
                    <p>Church: {churches.find(c => c.id == formData.church)?.name}</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}