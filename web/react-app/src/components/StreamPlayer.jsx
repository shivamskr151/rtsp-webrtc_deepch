import { useState, useEffect, useRef } from 'react';

function StreamPlayer({ streamId }) {
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const reconnectTimerRef = useRef(null);

    const initializeWebRTC = async () => {
        try {
            setStatus('connecting');
            setError(null);

            // Fetch ICE servers from API
            const iceResponse = await fetch('/api/ice-servers');
            const iceConfig = await iceResponse.json();
            
            // Create new RTCPeerConnection with configured ICE servers
            const pc = new RTCPeerConnection({ iceServers: iceConfig.iceServers });
            pcRef.current = pc;

            // Create MediaStream for video
            const stream = new MediaStream();

            // Handle incoming tracks
            pc.ontrack = (event) => {
                console.log(`[${streamId}] Track received:`, event.track.kind);
                stream.addTrack(event.track);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            };

            // Monitor ICE candidate events
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log(`[${streamId}] ICE Candidate:`, event.candidate.candidate);
                } else {
                    console.log(`[${streamId}] ICE Gathering Complete`);
                }
            };

            // Monitor ICE connection state
            pc.oniceconnectionstatechange = () => {
                const state = pc.iceConnectionState;
                console.log(`[${streamId}] ICE Connection State:`, state);

                switch (state) {
                    case 'connected':
                    case 'completed':
                        setStatus('connected');
                        if (reconnectTimerRef.current) {
                            clearTimeout(reconnectTimerRef.current);
                            reconnectTimerRef.current = null;
                        }
                        break;
                    case 'disconnected':
                        console.log(`[${streamId}] ICE disconnected, attempting to reconnect...`);
                        setStatus('connecting');
                        // Don't reconnect immediately on disconnected - wait a bit
                        if (!reconnectTimerRef.current) {
                            scheduleReconnect();
                        }
                        break;
                    case 'failed':
                        console.error(`[${streamId}] ICE connection failed`);
                        setStatus('failed');
                        setError('Connection failed');
                        scheduleReconnect();
                        break;
                    case 'closed':
                        setStatus('failed');
                        break;
                }
            };

            // Monitor connection state (includes DTLS)
            pc.onconnectionstatechange = () => {
                console.log(`[${streamId}] Connection State:`, pc.connectionState);
            };

            // Get codec information
            const codecResponse = await fetch(`/stream/codec/${streamId}`);
            const codecs = await codecResponse.json();

            console.log(`[${streamId}] Codecs:`, codecs);

            // Add transceivers for each codec (recvonly for receiving video/audio)
            codecs.forEach(codec => {
                pc.addTransceiver(codec.Type, { direction: 'recvonly' });
            });

            // Create offer with proper options
            const offer = await pc.createOffer({
                offerToReceiveVideo: true,
                offerToReceiveAudio: true
            });
            await pc.setLocalDescription(offer);

            // Wait for ICE gathering to complete (or timeout after 5 seconds)
            await new Promise((resolve, reject) => {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    const checkState = () => {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    };
                    pc.addEventListener('icegatheringstatechange', checkState);
                    setTimeout(() => {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve(); // Continue even if gathering not complete
                    }, 5000);
                }
            });

            // Send offer to server and get answer
            const response = await fetch(`/stream/receiver/${streamId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `suuid=${streamId}&data=${btoa(pc.localDescription.sdp)}`
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const answerSdp = await response.text();

            if (!answerSdp || answerSdp.trim() === '') {
                throw new Error('Empty answer from server');
            }

            // Set remote description
            await pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: atob(answerSdp)
                })
            );

            console.log(`[${streamId}] WebRTC connection established, waiting for tracks...`);

        } catch (err) {
            console.error(`[${streamId}] Error:`, err);
            setStatus('failed');
            setError(err.message);
            scheduleReconnect();
        }
    };

    const scheduleReconnect = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
        }

        reconnectTimerRef.current = setTimeout(() => {
            console.log(`[${streamId}] Attempting reconnection...`);
            cleanup();
            initializeWebRTC();
        }, 3000);
    };

    const cleanup = () => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            }
        }
    };

    useEffect(() => {
        initializeWebRTC();
        return cleanup;
    }, [streamId]);

    const getStatusText = () => {
        switch (status) {
            case 'connecting': return 'Connecting...';
            case 'connected': return 'Connected';
            case 'failed': return error || 'Failed';
            default: return status;
        }
    };

    return (
        <div className="stream-card">
            <div className="stream-header">
                <div className="stream-title">Camera: {streamId}</div>
                <div className={`status-indicator status-${status}`}>
                    <div className="status-dot"></div>
                    {getStatusText()}
                </div>
            </div>
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                />
                {status === 'connecting' && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                )}
                <button className="fullscreen-btn" onClick={toggleFullscreen}>
                    ⛶ Fullscreen
                </button>
            </div>
        </div>
    );
}

export default StreamPlayer;
