'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import RegistrationForm from '../components/RegistrationForm/page';
import MeetingInfo from '../components/MeetingInfo/page';
import CountdownTimer from '../components/CountdownTimer/page';

export default function Home() {
  const [meetingData, setMeetingData] = useState({
    title: 'Camporee 2025',
    date: '2023-12-01',
    deadline: '2025-11-30T23:59:59',
    registrationAmount: 1000,
    posterUrl: '/default-poster.jpg',
    description: 'Join us for spiritual growth and fellowship'
  });

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

  // Fetch meeting data from backend
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/meeting');
        const data = await response.json();
        setMeetingData({
          title: data.title,
          date: data.date,
          deadline: data.deadline,
          registrationAmount: data.registration_amount,
          posterUrl: data.poster_url,
          description: data.description
        });
      } catch (error) {
        console.error('Error fetching meeting data:', error);
      }
    };

    fetchMeetingData();
  }, []);

  // Check if registration deadline has passed
  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();
      const deadline = new Date(meetingData.deadline);
      setIsRegistrationOpen(now < deadline);
    };
    
    checkDeadline();
    const interval = setInterval(checkDeadline, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [meetingData.deadline]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>SDA Church Registration - {meetingData.title}</title>
        <meta name="description" content="Register for SDA Church meetings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-800 text-white p-4 text-center">
        <img src="/sda-logo.png" alt="SDA Church Logo" className="h-20 mx-auto" />
        <h1 className="text-2xl font-bold mt-2">Greater Rift Valley Conference</h1>
        <p className="text-sm">Seventh-day Adventist Church</p>
      </header>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <img 
              src={meetingData.posterUrl} 
              alt={meetingData.title} 
              className="w-full rounded-lg shadow-md" 
            />
          </div>
          <div className="flex-1">
            <MeetingInfo meetingData={meetingData} />
            <CountdownTimer deadline={meetingData.deadline} />
            
            {!isRegistrationOpen && (
              <div className="bg-red-100 text-red-700 p-4 rounded-md mt-4">
                <h3 className="font-bold text-lg">Registration Closed</h3>
                <p>The registration deadline has passed.</p>
              </div>
            )}
          </div>
        </div>

        {isRegistrationOpen && <RegistrationForm meetingData={meetingData} />}
      </main>

      <footer className="bg-gray-100 p-4 text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} Greater Rift Valley Conference - SDA Church</p>
      </footer>
    </div>
  );
}