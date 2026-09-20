import { useEffect, useRef, useState } from 'react'
import { Button, Text, Textarea, View } from '@tarojs/components'
import { mockShareAdapter } from '../../platform/share'
import type { Commitment, RealityAttempt, RealityEventType, Relationship } from '../../domain/models'
import { openSharedStates, resolvedSharedStates } from '../../domain/models'
import './index.scss'

type Screen = 'home' | 'say' | 'context' | 'share' | 'answer' | 'declined' | 'magic' | 'relationship' | 'relationshipSettings' | 'detail' | 'letGoConfirm' | 'realAnswer' | 'fulfillAnswer' | 'pool' | 'sinkMagic' | 'surfaceMagic'
type ContextKey = 'photo' | 'time' | 'place'
const goldenSteps: Screen[] = ['home', 'say', 'context', 'share', 'answer', 'magic', 'relationship', 'detail']
const realityEventCopy: Record<RealityEventType, string> = {
  PROPOSED: 'Yuki：要不要来真的？',
  ACCEPTED: 'Jack：好，来真的。',
  DECLINED: 'Jack：这次先不来真的。',
  DID_NOT_HAPPEN: '这一次又没成。',
  LET_GO: 'Yuki：算啦。',
  FULFILLMENT_PROPOSED: 'Yuki：这次兑现了吗？',
  FULFILLMENT_CONFIRMED: 'Jack：算兑现。',
  FULFILLMENT_NOT_YET: 'Jack：这次还没有兑现。'
}

const BrandStar = ({ className = '' }: { className?: string }) => <View className={`brand-star ${className}`} aria-hidden='true' />
const WishingFountain = ({ className = '' }: { className?: string }) => <View className={`wishing-fountain ${className}`} aria-hidden='true'><View className='garden-branch' /><View className='petal-shadow' /><View className='fountain-basin'><View className='water-reflection' /><View className='spring-eye'><View className='spring-water' /></View><View className='fountain-ripple' /><View className='sun-dapple' /></View></View>
const initialContext = (): Record<ContextKey, boolean> => ({ photo: false, time: false, place: false })
const initialRelationship = (): Relationship => ({ id: 'yuki-jack', people: [{ id: 'yuki', name: 'Yuki' }, { id: 'jack', name: 'Jack' }], visibilityByPerson: { yuki: 'VISIBLE', jack: 'VISIBLE' }, acceptsNewProposalsByPerson: { yuki: true, jack: true } })

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home')
  const [words, setWords] = useState('下次一起去看海。')
  const [context, setContext] = useState<Record<ContextKey, boolean>>(initialContext)
  const [sending, setSending] = useState(false)
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [relationship, setRelationship] = useState<Relationship>(initialRelationship)
  const [poolSelected, setPoolSelected] = useState(false)
  const [signalFeedback, setSignalFeedback] = useState(false)
  const transitionTimers = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const stepIndex = goldenSteps.indexOf(screen)

  const schedule = (action: () => void, delay: number) => {
    const timer = setTimeout(action, delay)
    transitionTimers.current.push(timer)
  }
  const clearScheduledTransitions = () => {
    transitionTimers.current.forEach(clearTimeout)
    transitionTimers.current = []
  }
  useEffect(() => clearScheduledTransitions, [])

  const resetPrototype = () => {
    clearScheduledTransitions()
    setWords('下次一起去看海。')
    setContext(initialContext())
    setSending(false)
    setCommitment(null)
    setRelationship(initialRelationship())
    setPoolSelected(false)
    setSignalFeedback(false)
    setScreen('home')
  }

  const toggleContext = (key: ContextKey) => setContext(current => ({ ...current, [key]: !current[key] }))
  const share = async () => {
    setSending(true)
    const result = await mockShareAdapter.shareProposal({ words, recipient: '微信朋友' })
    setSending(false)
    if (result.delivered) setScreen('answer')
  }
  const accept = () => {
    setCommitment({ id: 'commitment-alpha-03', relationshipId: 'yuki-jack', words, createdBy: 'yuki', sharedState: 'SHARED', visibilityState: 'SURFACED', signals: [], realityAttempts: [], createdAt: new Date().toISOString(), sharedAt: new Date().toISOString() })
    setScreen('magic')
    schedule(() => setScreen('relationship'), 2100)
  }
  const decline = () => {
    setCommitment(null)
    setScreen('declined')
  }
  const sinkForPrototype = () => {
    if (!commitment || commitment.visibilityState !== 'SURFACED') return
    setCommitment({ ...commitment, visibilityState: 'SUNK' })
    setScreen('sinkMagic')
    schedule(() => setScreen('relationship'), 1500)
  }
  const liftFromPool = () => {
    if (!commitment) return
    setCommitment({ ...commitment, visibilityState: 'SURFACED' })
    setPoolSelected(false)
    setScreen('surfaceMagic')
    schedule(() => setScreen('detail'), 1600)
  }
  const wantStill = (visibility: 'SHARED' | 'SELF_ONLY' = 'SHARED') => {
    if (!commitment || commitment.signals.some(signal => signal.actorId === 'yuki' && signal.type === 'WANT_STILL' && signal.visibility === visibility)) return
    setCommitment({ ...commitment, signals: [...commitment.signals, { id: `signal-${Date.now()}`, type: 'WANT_STILL', actorId: 'yuki', visibility, createdAt: new Date().toISOString() }] })
    setSignalFeedback(true)
    schedule(() => setSignalFeedback(false), 1800)
  }
  const replaceLatestAttempt = (attempt: RealityAttempt) => {
    if (!commitment) return []
    return commitment.realityAttempts.map(item => item.id === attempt.id ? attempt : item)
  }
  const startReality = () => {
    if (!commitment || commitment.sharedState !== 'SHARED') return
    const proposedAt = new Date().toISOString()
    const attempt: RealityAttempt = { id: `reality-${Date.now()}`, proposedBy: 'yuki', state: 'PENDING', proposedAt, events: [{ type: 'PROPOSED', actorId: 'yuki', createdAt: proposedAt }] }
    setCommitment({ ...commitment, sharedState: 'REAL_PENDING', realityAttempts: [...commitment.realityAttempts, attempt] })
    setScreen('realAnswer')
  }
  const answerReality = (accepted: boolean) => {
    if (!commitment || commitment.sharedState !== 'REAL_PENDING') return
    const latest = commitment.realityAttempts[commitment.realityAttempts.length - 1]
    if (!latest) return
    const respondedAt = new Date().toISOString()
    const attempt: RealityAttempt = { ...latest, state: accepted ? 'ACTIVE' : 'DECLINED', respondedAt, events: [...latest.events, { type: accepted ? 'ACCEPTED' : 'DECLINED', actorId: 'jack', createdAt: respondedAt }], ...(!accepted && { resolvedAt: respondedAt }) }
    setCommitment({ ...commitment, sharedState: accepted ? 'REAL' : 'SHARED', realityAttempts: replaceLatestAttempt(attempt) })
    setScreen('detail')
  }
  const realityDidNotHappen = () => {
    if (!commitment || commitment.sharedState !== 'REAL') return
    const latest = commitment.realityAttempts[commitment.realityAttempts.length - 1]
    if (!latest) return
    const resolvedAt = new Date().toISOString()
    const attempt: RealityAttempt = { ...latest, state: 'DID_NOT_HAPPEN', resolvedAt, events: [...latest.events, { type: 'DID_NOT_HAPPEN', actorId: 'yuki', createdAt: resolvedAt }] }
    setCommitment({ ...commitment, sharedState: 'SHARED', realityAttempts: replaceLatestAttempt(attempt) })
  }
  const proposeFulfilled = () => {
    if (!commitment || commitment.sharedState !== 'REAL') return
    const latest = commitment.realityAttempts[commitment.realityAttempts.length - 1]
    if (!latest) return
    const proposedAt = new Date().toISOString()
    const attempt: RealityAttempt = { ...latest, state: 'FULFILLED_PENDING', events: [...latest.events, { type: 'FULFILLMENT_PROPOSED', actorId: 'yuki', createdAt: proposedAt }] }
    setCommitment({ ...commitment, sharedState: 'FULFILLED_PENDING', realityAttempts: replaceLatestAttempt(attempt) })
    setScreen('fulfillAnswer')
  }
  const answerFulfilled = (accepted: boolean) => {
    if (!commitment || commitment.sharedState !== 'FULFILLED_PENDING') return
    const latest = commitment.realityAttempts[commitment.realityAttempts.length - 1]
    if (!latest) return
    const respondedAt = new Date().toISOString()
    const attempt: RealityAttempt = { ...latest, state: accepted ? 'FULFILLED' : 'ACTIVE', events: [...latest.events, { type: accepted ? 'FULFILLMENT_CONFIRMED' : 'FULFILLMENT_NOT_YET', actorId: 'jack', createdAt: respondedAt }], ...((accepted ? { resolvedAt: respondedAt } : {})) }
    setCommitment({ ...commitment, sharedState: accepted ? 'FULFILLED' : 'REAL', visibilityState: accepted ? null : commitment.visibilityState, realityAttempts: replaceLatestAttempt(attempt), ...(accepted && { resolvedAt: new Date().toISOString() }) })
    setScreen('detail')
  }
  const letGo = () => {
    if (!commitment || resolvedSharedStates.includes(commitment.sharedState)) return
    const resolvedAt = new Date().toISOString()
    const latest = commitment.realityAttempts[commitment.realityAttempts.length - 1]
    const realityAttempts = commitment.sharedState === 'REAL' && latest
      ? replaceLatestAttempt({ ...latest, state: 'ABANDONED', resolvedAt, events: [...latest.events, { type: 'LET_GO', actorId: 'yuki', createdAt: resolvedAt }] })
      : commitment.realityAttempts
    setCommitment({ ...commitment, sharedState: 'LET_GO', visibilityState: null, realityAttempts, resolvedAt })
    setScreen('detail')
  }
  const toggleRelationshipVisibility = () => setRelationship(current => ({ ...current, visibilityByPerson: { ...current.visibilityByPerson, yuki: current.visibilityByPerson.yuki === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE' } }))
  const toggleNewProposals = () => setRelationship(current => ({ ...current, acceptsNewProposalsByPerson: { ...current.acceptsNewProposalsByPerson, yuki: !current.acceptsNewProposalsByPerson.yuki } }))
  const back = () => {
    if (screen === 'pool' || screen === 'detail') return setScreen('relationship')
    if (screen === 'relationshipSettings') return setScreen('relationship')
    if (screen === 'letGoConfirm') return setScreen('detail')
    if (screen === 'realAnswer' || screen === 'fulfillAnswer') return setScreen('detail')
    if (screen === 'declined') return setScreen('answer')
    setScreen(goldenSteps[Math.max(0, goldenSteps.indexOf(screen) - 1)])
  }

  const isOpenCommitment = commitment ? openSharedStates.includes(commitment.sharedState) : false
  const isResolvedCommitment = commitment ? resolvedSharedStates.includes(commitment.sharedState) : false

  return <View className='shell'>
    <View className='phone'>
      <View className='statusbar'><Text>9:41</Text><Text className='status-icons'>● ◒</Text></View>
      {!['home', 'magic', 'sinkMagic', 'surfaceMagic'].includes(screen) && <View className='topbar'><Button className='icon-button' onClick={back} aria-label='返回'>‹</Button><Text className='wordmark'>下次一定</Text><View className='topbar-spacer' /></View>}

      {screen === 'home' && <View className='screen home'><View className='home-garden-branch' aria-hidden='true' /><View className='home-water-glow' aria-hidden='true' /><View className='home-copy'><Text className='display'>我们</Text><Text className='lead'>那些说过的以后，{`\n`}会从这里开始。</Text></View><WishingFountain className='home-fountain' /><Button className='primary' onClick={() => setScreen('say')}>说一个下次</Button><View className='nav'><Text className='active'>我们</Text><Text>后来</Text><Text>我</Text></View></View>}

      {screen === 'say' && <View className='screen form-screen'><Text className='eyebrow'>原话</Text><Text className='title'>说一个下次</Text><Text className='hint'>就写下你真正想对 TA 说的那句话。</Text><View className='field big'><Textarea maxlength={60} value={words} onInput={event => setWords(event.detail.value)} /></View><Text className='counter'>{words.length} / 60</Text><View className='spacer' /><Button className='primary' disabled={!words.trim()} onClick={() => setScreen('context')}>继续</Button></View>}

      {screen === 'context' && <View className='screen form-screen'><Text className='eyebrow'>可选补充</Text><Text className='title'>还想多留一点吗？</Text><Text className='hint'>这些只是帮助 TA 理解，不会改变你们要说算数的原话。</Text><View className='context-list'>{([['photo', '一张图片', '已选一张'], ['time', '大概什么时候', '天气暖一点'], ['place', '大概在哪里', '海边']] as const).map(([key, label, value]) => <Button key={key} className={context[key] ? 'context-row selected' : 'context-row'} onClick={() => toggleContext(key)}><Text>＋ {label}</Text><Text>{context[key] ? value : '可选'}</Text></Button>)}</View><View className='spacer' /><Button className='primary' onClick={() => setScreen('share')}>{Object.values(context).some(Boolean) ? '带上这些' : '跳过'}</Button></View>}

      {screen === 'share' && <View className='screen share-screen'><Text className='eyebrow'>说给谁听？</Text><Text className='share-quote'>{words}</Text><Text className='hint'>发给那个你想到的人。</Text><View className='wechat-card'><View className='share-wash' /><BrandStar className='outline-star share-star' /><Text className='card-kicker'>Yuki 说了一个下次</Text><Text className='card-quote'>“{words}”</Text><Text className='waiting-copy'>等你说算数。</Text><View className='card-footer'><Text>下次一定</Text><Text>打开看看 ›</Text></View></View><View className='spacer' /><Button className='wechat' loading={sending} onClick={share}>{sending ? '正在打开微信' : '发给微信朋友'}</Button></View>}

      {screen === 'answer' && <View className='screen answer-screen'><Text className='eyebrow'>Yuki 说了一个下次</Text><Text className='quote'>“{words}”</Text>{(context.time || context.place) && <View className='context-preview'>{context.time && <Text>大概：天气暖一点</Text>}{context.place && <Text>地点：海边</Text>}</View>}<View className='answer-copy'><Text className='title'>算数吗？</Text></View><View className='spacer' /><Button className='primary' onClick={accept}>算数</Button><Button className='text-button' onClick={decline}>这次不算</Button></View>}

      {screen === 'declined' && <View className='screen declined-screen'><Text className='eyebrow'>这一次</Text><View className='declined-mark'><BrandStar className='outline-star declined-star' /><View className='declined-line' /></View><Text className='title'>这次不算。</Text><Text className='hint'>这句话没有成为你们共同的以后。</Text><Text className='declined-note'>Yuki 会知道这次没有算数。你不需要说明原因。</Text><View className='spacer' /><Button className='secondary' onClick={() => setScreen('home')}>回到首页</Button></View>}

      {screen === 'magic' && <View className='screen magic' aria-live='polite'><View className='light-world'><WishingFountain className='m01-fountain' /><BrandStar className='falling-star' /><View className='ripple r1' /></View><Text className='magic-title'>我们说好了。</Text><Text className='magic-sub'>这句话，留在了你们之间。</Text></View>}

      {screen === 'realAnswer' && <View className='screen decision-screen'><Text className='eyebrow'>Yuki 想把这句话带进现实</Text><Text className='quote'>“{words}”</Text><View className='decision-copy'><Text className='title'>要来真的吗？</Text><Text className='hint'>只有你也答应，才会开始这一次现实尝试。</Text></View><View className='spacer' /><Button className='primary' onClick={() => answerReality(true)}>好，来真的</Button><Button className='text-button' onClick={() => answerReality(false)}>这次先不了</Button></View>}

      {screen === 'fulfillAnswer' && <View className='screen decision-screen'><Text className='eyebrow'>Yuki 说这次已经发生了</Text><Text className='quote'>“{words}”</Text><View className='decision-copy'><Text className='title'>算兑现吗？</Text><Text className='hint'>你们都确认后，它才会成为共同的后来。</Text></View><View className='spacer' /><Button className='primary' onClick={() => answerFulfilled(true)}>算兑现</Button><Button className='text-button' onClick={() => answerFulfilled(false)}>还没有</Button></View>}

      {screen === 'sinkMagic' && <View className='screen pool-magic' aria-live='polite'><View className='pool-scene'><WishingFountain className='transition-fountain' /><BrandStar className='sunken-star' /><View className='soft-water w1' /><View className='soft-water w2' /></View><Text className='pool-magic-title'>它慢慢沉进了池里。</Text><Text className='pool-magic-sub'>没有消失，只是暂时安静下来。</Text></View>}
      {screen === 'surfaceMagic' && <View className='screen pool-magic surface-magic' aria-live='polite'><View className='pool-scene'><WishingFountain className='transition-fountain' /><BrandStar className='rising-star' /><View className='soft-water w1' /><View className='soft-water w2' /></View><Text className='pool-magic-title'>又见到它了。</Text><Text className='pool-magic-sub'>它一直都在。</Text></View>}

      {screen === 'relationship' && <View className='screen relationship'>
        <View className='relationship-heading'><Text className='title'>我和 Jack</Text><Button className='boundary-link' aria-label='关系边界' onClick={() => setScreen('relationshipSettings')}>···</Button></View>
        <Text className='hint'>这里留着一些我们说过的话。</Text>
        {relationship.visibilityByPerson.yuki === 'HIDDEN' && <Text className='boundary-banner'>这段关系已从你的首页收起，历史仍然留在这里。</Text>}
        {!relationship.acceptsNewProposalsByPerson.yuki && <Text className='boundary-banner'>你目前不接收 Jack 新的“下次”。</Text>}
        <View className='relationship-section'><Text className='section-label'>还在</Text>{isOpenCommitment && commitment?.visibilityState === 'SURFACED' ? <Button className='commitment-row' onClick={() => setScreen('detail')}><BrandStar className='commitment-star' /><View className='commitment-copy'><Text className='commitment-words'>{words}</Text><Text className='commitment-status'>{commitment.sharedState === 'REAL' ? '正在来真的。' : commitment.sharedState === 'REAL_PENDING' ? '等 Jack 回应“来真的”。' : commitment.sharedState === 'FULFILLED_PENDING' ? '等 Jack 确认兑现。' : commitment.signals.length ? 'Yuki：还想。' : '我们说好了 · 刚刚'}</Text></View><Text className='chevron'>›</Text></Button> : <Text className='section-empty'>现在没有等着发生的以后。</Text>}</View>
        <Button className='pool-entry' aria-label='看看池底' onClick={() => setScreen('pool')}><Text className='pool-entry-label'>池</Text><View className='pool-window'><WishingFountain className='relationship-fountain' />{commitment?.visibilityState === 'SUNK' && <BrandStar className='pool-window-star' />}</View><Text className='pool-entry-link'>看看池底 →</Text></Button>
        <View className='relationship-section later-section'><Text className='section-label'>后来</Text>{isResolvedCommitment ? <Button className='commitment-row later-row' onClick={() => setScreen('detail')}><BrandStar className='commitment-star' /><View className='commitment-copy'><Text className='commitment-words'>{words}</Text><Text className='commitment-status'>{commitment?.sharedState === 'FULFILLED' ? '我们兑现了。' : commitment?.sharedState === 'LET_GO' ? '我们算啦。' : '这句话有了后来。'}</Text></View><Text className='chevron'>›</Text></Button> : <Text className='section-empty'>这里还没有后来。</Text>}</View>
        <View className='spacer' /><Button className='secondary' onClick={() => setScreen('say')}>再说一个下次</Button>
      </View>}

      {screen === 'relationshipSettings' && <View className='screen boundary-screen'>
        <Text className='eyebrow'>只影响你这一边</Text><Text className='title'>关系边界</Text><Text className='hint'>这些设置彼此独立，也不会改写你们已经留下的共同事实。</Text>
        <View className='boundary-list'>
          <Button className='boundary-row' onClick={toggleRelationshipVisibility}><View><Text className='boundary-title'>收起这段关系</Text><Text className='boundary-copy'>不再出现在你的首页和回忆里，对方不会收到通知。</Text></View><Text className={relationship.visibilityByPerson.yuki === 'HIDDEN' ? 'switch on' : 'switch'}>{relationship.visibilityByPerson.yuki === 'HIDDEN' ? '已收起' : '显示中'}</Text></Button>
          <Button className='boundary-row' onClick={toggleNewProposals}><View><Text className='boundary-title'>不再接收新提议</Text><Text className='boundary-copy'>过去的内容保留，Jack 暂时不能发来新的“下次”。</Text></View><Text className={!relationship.acceptsNewProposalsByPerson.yuki ? 'switch on' : 'switch'}>{!relationship.acceptsNewProposalsByPerson.yuki ? '已关闭' : '接收中'}</Text></Button>
        </View>
        <View className='spacer' /><Text className='boundary-footnote'>收起关系不等于算啦；拒收新提议也不会结束任何一条已经算数的话。</Text>
      </View>}

      {screen === 'pool' && <View className='screen pool-screen'><Text className='eyebrow'>我和 Jack</Text><Text className='title'>池</Text><Text className='hint'>有些以后，只是暂时沉到了时间里。</Text><View className={poolSelected ? 'spatial-pool has-selection' : 'spatial-pool'}><WishingFountain className='pool-fountain' />{commitment?.visibilityState === 'SUNK' && <Button className='pool-star-button' aria-label='查看沉下去的那句话' onClick={() => setPoolSelected(true)}><BrandStar className='real-star' /></Button>}{poolSelected && <><View className='pool-selection-fog' /><View className='pool-selection'><Text className='selected-words'>{words}</Text><Text className='selected-meta'>这句话一直都在。</Text><Button className='lift-button' onClick={liftFromPool}>捞起来</Button><Button className='look-button' onClick={() => setPoolSelected(false)}>再看看</Button></View></>}{commitment?.visibilityState !== 'SUNK' && <Text className='pool-empty-copy'>池里现在很安静。{`\n`}还没有什么沉到这里。</Text>}</View></View>}

      {screen === 'detail' && <View className='screen detail'>
        <View className='detail-heading'><Text className='eyebrow'>{commitment?.sharedState === 'REAL' ? '正在来真的' : commitment?.sharedState === 'FULFILLED' ? '已经兑现' : commitment?.sharedState === 'LET_GO' ? '已经算啦' : '我们说好的'}</Text>{(commitment?.sharedState === 'FULFILLED' || commitment?.sharedState === 'LET_GO') && <Text className='state-chip'>后来</Text>}</View>
        <Text className='detail-quote'>{words}</Text><Text className='relationship-link'>我和 Jack</Text><BrandStar className='detail-star' />
        <View className='timeline'><Text className='timeline-title'>这句话的后来</Text><View className='event'><Text className='dot'>•</Text><View><Text>Yuki 说了这句话。</Text><Text className='date'>今天 · 09:41</Text></View></View><View className='event'><Text className='dot gold'>•</Text><View><Text>Jack：算数。</Text><Text className='date'>刚刚</Text></View></View>{commitment?.signals.filter(signal => signal.visibility === 'SHARED').map(signal => <View className='event' key={signal.id}><Text className='dot apricot'>•</Text><View><Text>Yuki：还想。</Text><Text className='date'>刚刚</Text></View></View>)}{commitment?.realityAttempts.flatMap(attempt => attempt.events.map((event, index) => <View className='event' key={`${attempt.id}-${index}`}><Text className={event.type === 'FULFILLMENT_CONFIRMED' ? 'dot gold' : 'dot apricot'}>•</Text><View><Text>{realityEventCopy[event.type]}</Text><Text className='date'>刚刚</Text></View></View>))}{commitment?.sharedState === 'LET_GO' && !commitment.realityAttempts.some(attempt => attempt.events.some(event => event.type === 'LET_GO')) && <View className='event'><Text className='dot'>•</Text><View><Text>Yuki：算啦。</Text><Text className='date'>刚刚</Text></View></View>}{commitment?.signals.filter(signal => signal.visibility === 'SELF_ONLY').map(signal => <View className='event' key={signal.id}><Text className='dot apricot'>•</Text><View><Text>只留给你：我还想。</Text><Text className='date'>仅自己可见 · 刚刚</Text></View></View>)}</View>
        {signalFeedback && <Text className='signal-feedback'>{commitment?.sharedState === 'LET_GO' ? '已经只留给你。' : '已经留下：你还想。'}</Text>}
        <View className='spacer' />
        {commitment?.sharedState === 'SHARED' && <><Button className='secondary' onClick={() => wantStill()}>{commitment.signals.some(signal => signal.visibility === 'SHARED') ? '还想 · 已留下' : '还想'}</Button><Button className='primary detail-primary' onClick={startReality}>来真的</Button><Button className='detail-boundary-action' onClick={() => setScreen('letGoConfirm')}>算啦</Button><Text className='preview-label'>“还想”只表达现在的态度，不会移动这句话</Text></>}
        {commitment?.sharedState === 'REAL' && <><Button className='secondary' onClick={realityDidNotHappen}>又没成</Button><Button className='primary detail-primary' onClick={proposeFulfilled}>兑现</Button><Button className='detail-boundary-action' onClick={() => setScreen('letGoConfirm')}>算啦</Button></>}
        {commitment?.sharedState === 'REAL_PENDING' && <Text className='pending-copy'>等 Jack 回应“来真的”。</Text>}
        {commitment?.sharedState === 'FULFILLED_PENDING' && <Text className='pending-copy'>等 Jack 确认是否兑现。</Text>}
        {commitment?.sharedState === 'FULFILLED' && <Text className='resolved-copy'>这一次，已经成为你们共同的后来。</Text>}
        {commitment?.sharedState === 'LET_GO' && <><Text className='resolved-copy'>这句话已经结束共同的以后，原话仍留在后来。</Text><Button className='self-only-action' onClick={() => wantStill('SELF_ONLY')}>{commitment.signals.some(signal => signal.visibility === 'SELF_ONLY') ? '我还想 · 只留给我' : '我还想 · 只留给自己'}</Button></>}
      </View>}

      {screen === 'letGoConfirm' && <View className='screen let-go-screen'>
        <Text className='eyebrow'>结束这一条共同的以后</Text><Text className='quote'>“{words}”</Text><View className='let-go-copy'><Text className='title'>要算啦吗？</Text><Text className='hint'>它会离开“还在”，留进你们共同的“后来”。这个动作不能在原地撤回。</Text></View><View className='spacer' /><Button className='secondary' onClick={() => setScreen('detail')}>再想想</Button><Button className='let-go-button' onClick={letGo}>算啦</Button>
      </View>}
    </View>
    <View className='prototype-rail'><Text className='rail-title'>V3 · ALPHA 05</Text><Text>{stepIndex >= 0 ? `${String(stepIndex + 1).padStart(2, '0')} / ${String(goldenSteps.length).padStart(2, '0')}` : screen === 'declined' ? 'PROPOSAL · DECLINED' : screen === 'surfaceMagic' ? 'POOL · M03' : screen === 'sinkMagic' ? 'POOL · M02' : 'V3 · SPACE'}</Text><View className='rail-track'><View className='rail-progress' style={{ height: `${stepIndex >= 0 ? ((stepIndex + 1) / goldenSteps.length) * 100 : 100}%` }} /></View>{commitment?.sharedState === 'SHARED' && commitment.visibilityState === 'SURFACED' && (screen === 'relationship' || screen === 'detail') && <Button className='rail-simulate' onClick={sinkForPrototype}>模拟时间流逝</Button>}<Button className='rail-reset' onClick={resetPrototype}>重新开始</Button></View>
  </View>
}
