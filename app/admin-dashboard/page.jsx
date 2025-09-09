'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';



export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('registrations');
    const [registrations, setRegistrations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meetingConfig, setMeetingConfig] = useState({});
    const [locations, setLocations] = useState({ stations: [] });
    const [newStation, setNewStation] = useState('');
    const [newDistrict, setNewDistrict] = useState({stationId: '', name: '' });
    const [newChurch, setNewChurch] = useState({ stationId: '', districtId: '', name: '' });


    useEffect(() => {
        if (activeTab === 'registrations') {
            fetchRegistrations();
            fetchSummary();
        } else if (activeTab === 'config') {
            fetchMeetingConfig();
        } else if (activeTab === 'locations') {
            fetchLocations();
        }
    }, [activeTab]);

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/registrations');
            const data = await response.json();
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/summary');
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const fetchMeetingConfig = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/meeting');
            const data = await response.json();
            setMeetingConfig(data);
        } catch (error) {
            console.error('Error fetching meeting config:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/stations');
            const data = await response.json();
            setLocations({ stations: data });
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/registrations/export');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'registrations.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting registrations:', error);
        }
    };

    const UpdateMeetingConfig = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/meeting',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(meetingConfig),
                });

                if (response.ok) {
                    alert('Meeting configuration updated successfully');
                } else {
                    throw new Error('Failed to update config');
                }
            
        } catch (error) {
            console.error('Error updating meeting config:', error);
            alert('Failed to update meeting configuration');
        }
    };

    const addStation = async (e) => {
        e.preventDefault();
        if (!newStation) {
            alert('Please enter station name');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/stations',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newStation }),
                });

                if (response.ok) {
                    setNewStation('');
                    fetchLocations();
                    alert('Station added successfully');
                } else {
                    throw new Error('Failed to add station');
                }
        } catch (error) {
            console.error('Error adding station:', error);
            alert('Failed to add station');
        }
    };

    const addDistrict = async (e) => {
        e.preventDefault();
        if (!newDistrict.stationId || !newDistrict.name) {
            alert('Please select station and enter district name');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/stations/${newDistrict.stationId}/districts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newDistrict.name }),
            });

            if (response.ok) {
                setNewDistrict({stationId: '', name: '' });
                fetchLocations();
                alert('District added successfully');
            } else {
                throw new Error('Failed to add district');
            }
        } catch (error) {
            console.error('Error adding district:', error);
            alert('Failed to add district');
        }
    };

    const addChurch = async (e) => {
        e.preventDefault();
        if (!newChurch.stationId || !newChurch.districtId || !newChurch.name) {
            alert('Please select station, distict, and enter church name');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/stations/${newChurch.stationId}/districts/${newChurch.districtId}/churches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({ name: newChurch.name }),
            });
            if (response.ok) {
                setNewChurch({ stationId: '', districtId: '', name: '' });
                fetchLocations();
                alert('Church added successfully');
            } else {
                throw new Error('Failed to add church');
            }
        } catch (error) {
            console.error('Error adding church:', error);
            alert('Failed to add church');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Admin Dashboard - SDA Church Registration</title>
            </Head>
            <header className="bg-blue-800 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm">Greater Rift Valley Conference - SDA Church</p>
            </header>

            <nav className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto flex">
                    <button
                        className={`px-6 py-4 ${activeTab === 'registrations' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-700'}`}
                        onClick={() => setActiveTab('registrations')}
                    >
                        Registrations
                    </button>
                    <button
                        className={`px-6 py-4 ${activeTab === 'config' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-700'}`}
                        onClick={() => setActiveTab('config')}
                    >
                        Meeting Config 
                    </button>
                    <button
                        className={`px-6 py-4 ${activeTab === 'locations' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-700'}`}
                        onClick={() => setActiveTab('locations')}
                    >
                        Locations 
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                {activeTab === 'registrations' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registration Management</h2>
                        {summary && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-md text-center">
                                    <h3 className="text-sm text-gray-600">Total Registrations</h3>
                                    <p className="text-2xl font-bold text-blue-800">{summary.totalAttendees}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-md text-center">
                                    <h3 className="text-sm text-gray-600">Total Attendees</h3>
                                    <p className="text-2xl font-bold text-green-800">{summary.totalAttendees}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-md text-center">
                                    <h3 className="text-sm text-gray-600">Total Amount</h3>
                                    <p className="text-2xl font-bold text-yellow-800">KES{summary.totalAmount}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-md text-center">
                                    <h3 className="text-sm text-gray-600">Paid Amount</h3>
                                    <p className="text-2xl font-bold text-purple-800">KES {summary.paidAmount}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleExport}
                            className="bg-green-600 text-white px-4 rounded-md mb-6 hover:bg-green-700"
                        >
                            Export to Excel
                        </button>

                        <div className="overflow-x-auto">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">All Registrations</h3>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700">
                                        <th className="py-2 px-4 text-left">ID</th>
                                        <th className="py-2 px-4 text-left">Church</th>
                                        <th className="py-2 px-4 text-left">Leader</th>
                                        <th className="py-2 px-4 text-left">Phone</th>
                                        <th className="py-2 px-4 text-left">Attendees</th>
                                        <th className="py-2 px-4 text-left">Amount</th>
                                        <th className="py-2 px-4 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map(reg => (
                                        <tr key={reg.id} className="border-b border-gray-200">
                                            <td className="py-2 px-4">{reg.id}</td>
                                            <td className="py-2 px-4">{reg.church}</td>
                                            <td className="py-2 px-4">{reg.leaderName}</td>
                                            <td className="py-2 px-4">{reg.leaderPhone}</td>
                                            <td className="py-2 px-4">{reg.attendees.length}</td>
                                            <td className="py-2 px-4">KES {reg.Amount}</td>
                                            <td className="py-2 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${reg.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {reg.paid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meeting Configuration</h2>
                        <form onSubmit={updateMeetingConfig} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                                <input
                                    type="text"
                                    value={meetingConfig.title || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, title: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={meetingConfig.date || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, date: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                                <input
                                    type="date"
                                    value={meetingConfig.deadline || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, deadline: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Amount (KES)</label>
                                <input
                                    type="number"
                                    value={meetingConfig.registration_amount || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, registration_amount: parseInt(e.target.value)})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                                <input
                                    type="text"
                                    value={meetingConfig.poster_url || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, poster_url: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={meetingConfig.description || ''}
                                    onChange={(e) => setMeetingConfig({...meetingConfig, description: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounde-md"
                                    rows="4"
                                />
                            </div>

                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'locations' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semifold mb-3">Add Station</h3>
                                <form onSubmit={addStation}>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                                        <input
                                            type="text"
                                            value={newStation}
                                            onChange={(e) => setNewStation(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                                        Add Station
                                    </button>
                                </form>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-3">Add District</h3>
                                <form onSubmit={addDistrict}>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
                                        <select
                                            value={newDistrict.stationId}
                                            onChange={(e) => setNewDistrict({...newDistrict, stationId: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="">Select Station</option>
                                            {locations.stations.map(station => (
                                                <option key={station.id} value={station.id}>{station.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">District Name</label>
                                        <input
                                            type="text"
                                            value={newDistrict.name}
                                            onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                                        Add District
                                    </button>
                                </form>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-3">Add Church</h3>
                                <form onSubmit={addChurch}>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
                                        <select
                                            value={newChurch.stationId}
                                            onChange={(e) => setNewChurch({...newChurch, stationId: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="">Select Station</option>
                                            {locations.stations.map(station => (
                                                <option key={station.id} value={station.id}>{station.id}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                        <select
                                            value={newChurch.districtId}
                                            onChange={(e) => setNewChurch({...newChurch, districtId: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                            disabled={!newChurch.stationId}
                                        >
                                            <option value="">Select District</option>
                                            {newChurch.stationId &&
                                                locations.stations
                                                    .find(s => s.id == newChurch.stationId)
                                                    ?.districts.map(district => (
                                                        <option key={district.id} value={district.id}>{district.name}</option>
                                                    ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
                                        <input
                                            type="text"
                                            value={newChurch.name}
                                            onChange={(e) => setNewChurch({...newChurch, name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                                        Add Church
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Locations</h3>
                            {locations.stations.map(station => (
                                <div key={station.id} className="mb-6 bg-gray-50 p-4 rounded-md">
                                    <h4 className="text-lg font-medium text-blue-800">{station.name}</h4>
                                    {station.districts && station.districts.map(district => (
                                        <div key={district.id} className="ml-4 mt-3">
                                            <h5 className="text-md font-medium text-gray-700">{district.name}</h5>
                                            <ul className="ml-6 mt-1">
                                                {district.churches && district.churches.map(church => (
                                                    <li key={church.id} className="text-sm text-gray-600">• {church.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}