import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    ArrowLeft,
    Send,
    Phone,
    Video,
    MoreVertical,
    Smile,
    Paperclip,
} from "lucide-react";
import { createsocketconnection } from "../../utils/socket";
import { apiService } from "../../api/apiservices";
import { toast } from "sonner";

interface Message {
    id: string;
    text: string;
    senderId: string;
    time: string;
}

const Chat = () => {
    const { id } = useParams<{ id: string }>();
    const connectionData = useSelector((store: any) => store.connection);
    const currentUser: any = useSelector((store: any) => store.user);
    const targetUser = connectionData?.find(
        (item: any) => item._id === id
    );

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastTempIdRef = useRef<string | null>(null);

    const displayName = targetUser
        ? `${targetUser.firstName} ${targetUser.lastName || ""}`.trim()
        : "Developer Partner";

    const displayAvatar =
        targetUser?.photoUrl ??
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!id) return;

        const fetchChatHistory = async () => {
            try {
                setIsLoadingHistory(true);
                const response: any = await apiService.get(`getchat/${id}`);
                const chatData = response?.data;

                if (chatData?.messages?.length) {
                    const historicMessages: Message[] = chatData.messages.map(
                        (msg: any) => ({
                            id: msg._id,
                            text: msg.text,
                            senderId:
                                typeof msg.senderId === "object"
                                    ? msg.senderId._id
                                    : msg.senderId,
                            time: new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        })
                    );
                    setMessages(historicMessages);
                }
            } catch (err) {
                console.error("Failed to load chat history:", err);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        fetchChatHistory();
    }, [id]);

    useEffect(() => {
        if (!currentUser?._id) return;
        const socket = createsocketconnection();
        const doJoin = () => {
            socket.emit("joinChat", {
                firstName: currentUser.firstName,
                userId: currentUser._id,
                targetUserId: id,
            });
        };

        if (socket.connected) {
            doJoin();
        } else {
            socket.once("connect", doJoin);
        }

        const handleMessageReceived = ({ firstName, text }: any) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + Math.random(),
                    text,
                    senderId: id ?? "target",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        };

        const handleErrorMessage = ({ message }: { message: string }) => {
            toast.error(message, { position: "top-right" });
            // Roll back the optimistic message
            const tempId = lastTempIdRef.current;
            if (tempId) {
                setMessages((prev) => prev.filter((m) => m.id !== tempId));
                lastTempIdRef.current = null;
            }
        };

        socket.on("messageReceived", handleMessageReceived);
        socket.on("errorMessage", handleErrorMessage);

        return () => {
            // Only remove THIS component's listeners — do NOT disconnect the socket.
            // Disconnecting would kill the singleton for other components/re-renders.
            socket.off("messageReceived", handleMessageReceived);
            socket.off("errorMessage", handleErrorMessage);
            socket.off("connect", doJoin);
        };
    }, [currentUser?._id, id]);


    const sendMessage = () => {
        const messageText = newMessage.trim();
        if (!messageText) return;
        const tempId = Date.now().toString() + Math.random();
        lastTempIdRef.current = tempId;

        const socket = createsocketconnection();
        socket.emit('sendMessage', {
            firstName: currentUser.firstName,
            userId: currentUser._id,
            targetUserId: id,
            text: messageText,
        });
        setMessages((prev) => [
            ...prev,
            {
                id: tempId,
                text: messageText,
                senderId: currentUser?._id ?? "me",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);

        setNewMessage("");
    }

    return (
        <div className="chat-page">
            {/* ── Chat Top Navigation Bar ── */}
            <div className="chat-header">
                <div className="chat-header-user">
                    <Link to="/connection" className="chat-back-btn" title="Back to matches">
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="chat-avatar-wrapper">
                        <img src={displayAvatar} alt={displayName} className="chat-avatar" />
                        <span className="chat-online-dot" />
                    </div>

                    <div className="chat-user-details">
                        <div className="chat-user-name">{displayName}</div>
                        <div className="chat-user-status">
                            <span style={{ fontSize: "8px" }}>●</span> Online
                        </div>
                    </div>
                </div>

                <div className="chat-header-actions">
                    <button className="chat-action-btn" title="Start Voice Call">
                        <Phone size={18} />
                    </button>
                    <button className="chat-action-btn" title="Start Video Call">
                        <Video size={18} />
                    </button>
                    <button className="chat-action-btn" title="Options">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* ── Messages Scrollable Container ── */}
            <div className="chat-messages-container">
                <div className="chat-date-divider">
                    <span className="chat-date-badge">Today</span>
                </div>

                {isLoadingHistory ? (
                    <div className="chat-loading">
                        <span className="chat-loading-dot" />
                        <span className="chat-loading-dot" />
                        <span className="chat-loading-dot" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <p>No messages yet. Say hi! 👋</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOutgoing = msg.senderId === currentUser?._id;
                        return (
                            <div
                                key={msg.id}
                                className={`chat-message-row ${isOutgoing ? "outgoing" : "incoming"}`}
                            >
                                <div className="chat-bubble">{msg.text}</div>
                                <div className="chat-meta">
                                    <span>{msg.time}</span>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Anchor to auto-scroll to latest message */}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Message Input Form Bar ── */}
            <div className="chat-input-wrapper">
                <div className="chat-input-form">
                    <button type="button" className="chat-action-btn" title="Emoji">
                        <Smile size={20} />
                    </button>

                    <button type="button" className="chat-action-btn" title="Attach file">
                        <Paperclip size={20} />
                    </button>

                    <input
                        type="text"
                        className="chat-input"
                        placeholder={`Message ${targetUser?.firstName ?? "developer"}…`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />

                    <button
                        type="button"
                        className="chat-send-btn"
                        disabled={!newMessage.trim()}
                        title="Send Message"
                        onClick={sendMessage}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;