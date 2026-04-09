import { useContext } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const VideoCall = () => {
    const { roomId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Secure the route
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Force strict structure to mount 100% fullscreen height
    return (
        <div className="w-screen h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Custom Header overlay to allow escaping back to dashboard smoothly */}
            <div className="absolute top-0 left-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
               <div className="flex gap-4">
                  <button onClick={() => navigate('/dashboard')} className="text-white bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2">
                     <ArrowLeft size={16} /> Back to Dashboard
                  </button>
               </div>
               <div className="text-white text-sm font-medium tracking-wider drop-shadow-md">
                   FemmeCare Secure Tunnel
               </div>
            </div>

            <div className="flex-1 w-full h-full">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={`FemmeCare-Secure-Consult-${roomId}`}
                    configOverwrite={{
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        startScreenSharing: false,
                        enableEmailInStats: false
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    }}
                    userInfo={{
                        displayName: user.name || 'FemmeCare Patient'
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>
        </div>
    );
};

export default VideoCall;
