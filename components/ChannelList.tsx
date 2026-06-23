
import { useState } from "react";

import ChannelCard from "./ChannelCard";

type Props = {
  relays: any;
  onEditRelay: (relay: any) => void;
  onConfigureRelay: (relay: any) => void;
};

export default function ChannelList({
  relays,
  onEditRelay,
  onConfigureRelay,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const channels = Object.entries(relays || {});

  channels.sort((a: any, b: any) => {
    return Number(b[1].assigned) - Number(a[1].assigned);
  });

  return (
    <>
      {channels.map(([relayId, relay]: any) => (
        <ChannelCard
          key={relayId}
          relayId={relayId}
          relay={relay}
          expanded={expandedId === relayId}
          onEditRelay={onEditRelay}
          onConfigureRelay={onConfigureRelay}
          onPress={() => setExpandedId(expandedId === relayId ? null : relayId)}
        />
      ))}
    </>
  );
}