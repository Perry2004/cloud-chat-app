import { ThemeSelection } from "@/components/theme/ThemeSelection";
import { useProfile } from "@/hooks/queries/useProfile";
import { useSocket } from "@/hooks/useSocket";
import { Button, Link, Chip, Card, Input } from "@heroui/react";
import { useState, useEffect } from "react";

export function AppHome() {
  const profileQuery = useProfile();
  const { socket, isConnected } = useSocket();
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: any) => {
      console.log("Socket message received:", data);
      const msg = typeof data === "string" ? data : JSON.stringify(data);
      setReceivedMessages((prev) => [...prev, msg]);
    };

    const handleAny = (eventName: string, ...args: any[]) => {
      console.log(`Socket event '${eventName}' received with args:`, args);
    };

    socket.on("message", handleMessage);
    socket.on("response", handleMessage);
    socket.onAny(handleAny);

    return () => {
      socket.off("message", handleMessage);
      socket.off("response", handleMessage);
      socket.offAny(handleAny);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      console.log("Sending socket message:", message);
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        Cloud Chat App
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="danger-soft">Danger Soft</Button>
        <div className="text-(--new-accent)">Hello</div>
        <Link href={`http://localhost:8666/api/v1/account/auth/login`}>
          Login
        </Link>
        <Link href={`http://localhost:8666/api/v1/account/auth/logout`}>
          Logout
        </Link>
        <pre>{profileQuery.data?.email}</pre>
        <ThemeSelection />
      </div>

      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Socket Status:</span>
            {isConnected ? (
              <Chip color="success" size="sm" variant="soft">
                Connected
              </Chip>
            ) : (
              <Chip color="danger" size="sm" variant="soft">
                Disconnected
              </Chip>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            isDisabled={!isConnected || !message.trim()}
          >
            Send
          </Button>
        </div>

        <Card className="min-h-32 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-default-500 text-sm font-medium">
                Messages:
              </div>
              {receivedMessages.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => setReceivedMessages([])}
                >
                  Clear
                </Button>
              )}
            </div>
            {receivedMessages.length === 0 ? (
              <div className="text-default-400 text-xs">No messages yet...</div>
            ) : (
              <div className="flex flex-col gap-1">
                {receivedMessages.map((msg, i) => (
                  <div key={i} className="bg-default-100 rounded p-2 text-sm">
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
