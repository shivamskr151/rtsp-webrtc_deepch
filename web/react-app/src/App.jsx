import { useState, useEffect } from 'react'
import StreamPlayer from './components/StreamPlayer'

function App() {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Configure your streams here
        const configuredStreams = ['demo1', 'demo2'];
        setStreams(configuredStreams);
        setLoading(false);
    }, []);

    const getGridClass = () => {
        const count = streams.length;
        if (count === 1) return 'grid-1';
        if (count === 2) return 'grid-2';
        if (count === 3) return 'grid-3';
        return 'grid-4';
    };

    if (loading) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Loading streams...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <header>
                <h1>🎥 WebRTC Stream Viewer</h1>
                <p className="subtitle">Real-time video streaming from RTSP cameras</p>
            </header>

            {streams.length === 0 ? (
                <div className="error-message">
                    <h2>No Streams Available</h2>
                    <p>Please configure streams in config.json</p>
                </div>
            ) : (
                <div className={`stream-grid ${getGridClass()}`}>
                    {streams.map(streamId => (
                        <StreamPlayer
                            key={streamId}
                            streamId={streamId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
