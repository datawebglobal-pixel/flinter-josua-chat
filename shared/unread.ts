export type ChatIdentity = "Flinter" | "Josua";
export type ReadStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function unreadSessionKey(identity: ChatIdentity) {
  return `fj-chat-read-at:${identity}`;
}

export function isIncomingMessage(sender: ChatIdentity, viewer: ChatIdentity) {
  return sender !== viewer;
}

export function getLastReadAt(storage: ReadStorage, identity: ChatIdentity) {
  return Number(storage.getItem(unreadSessionKey(identity)) || 0);
}

export function markChatRead(storage: ReadStorage, identity: ChatIdentity, timestamp: number) {
  storage.setItem(unreadSessionKey(identity), String(timestamp));
  return timestamp;
}

export function resetChatRead(storage: ReadStorage, identity: ChatIdentity) {
  storage.removeItem(unreadSessionKey(identity));
}

export function switchIdentityReadState(storage: ReadStorage, previous: ChatIdentity, next: ChatIdentity) {
  resetChatRead(storage, previous);
  resetChatRead(storage, next);
  return 0;
}

export function countUnreadSince(messages: Array<{ sender: ChatIdentity; createdAt: Date | number }>, viewer: ChatIdentity, since: number) {
  return messages.filter(message => isIncomingMessage(message.sender, viewer) && new Date(message.createdAt).getTime() > since).length;
}
