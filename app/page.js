'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import RegistrationForm from '../components/RegistrationForm/page';
import MeetingInfo from '../components/MeetingInfo/page';
import CountdownTimer from '../components/CountdownTimer/page';


export default function Home() {
  const [meetingData, setMeetingData] = useState({
    title: 'Camporee 2025',
    date: '2025-12-01 to 2025-12-07',
    deadline: '2025-11-30T23:59:59',
    registrationAmount: 1000,
    posterUrl: '/camporee2025.jpg',
    description: 'Join us for an unforgetable week at Camporee 2025!'
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
    <div className="container">
      <Head>
        <title>Greater Rift Valley Conference SDA Church Registration - {meetingData.title}</title>
        <meta name="description" content="Register for GRVC meetings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <img src="/sda-logo.png" alt="SDA Church Logo" className="logo" />
        <h1>Greater Rift Valley Conference</h1>
        <p>Seventh-day Adventist Church</p>
      </header>

      <main className="main">
        <div className="meeting-header">
          <div className="poster-container">
            <img src={meetingData.posterUrl} alt={meetingData.title} className="poster" />
          </div>
          <div className="meeting-details">
            <MeetingInfo meetingData={meetingData} />
            <CountdownTimer deadline={meetingData.deadline} />

            {!isRegistrationOpen && (
              <div className="registration-closed">
                <h3>Registration Closed</h3>
                <p>The registration deadline has passed</p>
              </div>
            )}
          </div>
        </div>

        {isRegistrationOpen && <RegistrationForm meetingData={meetingData} />}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Greater Rift Valley Conference - SDA Church</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          background-color: #1a4e8e;
          color: white;
          padding: 1rem;
          text-align: center;
        }
        
        .header h1 {
          margin: 0.5rem 0;
        }
        
        .logo {
          height: 80px;
        }
        
        .main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .meeting-header {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .poster-container {
          flex: 1;
          min-width: 300px;
        }
        
        .poster {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .meeting-details {
          flex: 2;
          min-width: 300px;
        }
        
        .registration-closed {
          background-color: #ffebee;
          color: #c62828;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }
        
        .footer {
          background-color: #f5f5f5;
          padding: 1rem;
          text-align: center;
          margin-top: auto;
        }
      `}</style>
    </div>
  )
}