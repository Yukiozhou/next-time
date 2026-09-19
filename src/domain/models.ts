export type SharedState =
  | 'PENDING'
  | 'SHARED'
  | 'REAL_PENDING'
  | 'REAL'
  | 'FULFILLED_PENDING'
  | 'FULFILLED'
  | 'LET_GO'
  | 'DECLINED'
  | 'WITHDRAWN'

export type VisibilityState = 'SURFACED' | 'SUNK'
export type SignalType = 'WANT_STILL'
export type RelationshipVisibility = 'VISIBLE' | 'HIDDEN'

export interface Person {
  id: string
  name: string
  avatar?: string
}

export interface Relationship {
  id: string
  people: [Person, Person]
  visibilityByPerson: Record<string, RelationshipVisibility>
  acceptsNewProposalsByPerson: Record<string, boolean>
}

export interface Signal {
  id: string
  type: SignalType
  actorId: string
  visibility: 'SHARED' | 'SELF_ONLY'
  createdAt: string
}

export interface Commitment {
  id: string
  relationshipId: string
  words: string
  note?: string
  createdBy: string
  sharedState: SharedState
  visibilityState: VisibilityState | null
  signals: Signal[]
  createdAt: string
  sharedAt?: string
  resolvedAt?: string
}

export const openSharedStates: SharedState[] = ['SHARED', 'REAL_PENDING', 'REAL', 'FULFILLED_PENDING']
export const resolvedSharedStates: SharedState[] = ['FULFILLED', 'LET_GO', 'DECLINED', 'WITHDRAWN']
