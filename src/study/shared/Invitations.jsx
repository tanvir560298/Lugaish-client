export function Invitations({ items, open, pending, onAccept, onDecline }) {
  if (!items.length) return null;
  return <details className="sr-invitations" open={open}><summary>Study invitations ({items.length})</summary>
    {items.map(i => <div className="sr-invite" key={i.id}><p><strong>{i.inviter}</strong> invited you to <strong>{i.roomName}</strong>{i.tableNumber ? ` · Table ${i.tableNumber}` : ''}.<br />{i.available} places available · Expires {new Date(i.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <div className="sr-actions"><button className="ls-button" disabled={pending} onClick={() => onAccept({ roomId: i.roomId, invitationId: i.id })}>Accept</button><button className="ls-button" disabled={pending} onClick={() => onDecline({ roomId: i.roomId, invitationId: i.id })}>Decline</button></div>
    </div>)}
  </details>;
}
