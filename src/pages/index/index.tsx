import { useState } from 'react'
import { Button, Text, Textarea, View } from '@tarojs/components'
import { mockShareAdapter } from '../../platform/share'
import type { Commitment } from '../../domain/models'
import './index.scss'

type Screen = 'home' | 'say' | 'context' | 'share' | 'answer' | 'magic' | 'relationship' | 'detail' | 'pool' | 'sinkMagic' | 'surfaceMagic'
type ContextKey = 'photo' | 'time' | 'place'
const goldenSteps: Screen[] = ['home', 'say', 'context', 'share', 'answer', 'magic', 'relationship', 'detail']

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home')
  const [words, setWords] = useState('下次一起去看海。')
  const [context, setContext] = useState<Record<ContextKey, boolean>>({ photo: false, time: false, place: false })
  const [sending, setSending] = useState(false)
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [poolSelected, setPoolSelected] = useState(false)
  const [signalFeedback, setSignalFeedback] = useState(false)
  const stepIndex = goldenSteps.indexOf(screen)

  const toggleContext = (key: ContextKey) => setContext(current => ({ ...current, [key]: !current[key] }))
  const share = async () => {
    setSending(true)
    const result = await mockShareAdapter.shareProposal({ words, recipient: '微信朋友' })
    setSending(false)
    if (result.delivered) setScreen('answer')
  }
  const accept = () => {
    setCommitment({ id: 'commitment-alpha-03', relationshipId: 'yuki-alin', words, createdBy: 'yuki', sharedState: 'SHARED', visibilityState: 'SURFACED', signals: [], createdAt: new Date().toISOString(), sharedAt: new Date().toISOString() })
    setScreen('magic')
    setTimeout(() => setScreen('relationship'), 2100)
  }
  const sinkForPrototype = () => {
    if (!commitment || commitment.visibilityState !== 'SURFACED') return
    setCommitment({ ...commitment, visibilityState: 'SUNK' })
    setScreen('sinkMagic')
    setTimeout(() => setScreen('relationship'), 1500)
  }
  const liftFromPool = () => {
    if (!commitment) return
    setCommitment({ ...commitment, visibilityState: 'SURFACED' })
    setPoolSelected(false)
    setScreen('surfaceMagic')
    setTimeout(() => setScreen('relationship'), 1600)
  }
  const wantStill = () => {
    if (!commitment || commitment.signals.some(signal => signal.actorId === 'yuki' && signal.type === 'WANT_STILL')) return
    setCommitment({ ...commitment, signals: [...commitment.signals, { id: `signal-${Date.now()}`, type: 'WANT_STILL', actorId: 'yuki', visibility: 'SHARED', createdAt: new Date().toISOString() }] })
    setSignalFeedback(true)
    setTimeout(() => setSignalFeedback(false), 1800)
  }
  const back = () => {
    if (screen === 'pool' || screen === 'detail') return setScreen('relationship')
    setScreen(goldenSteps[Math.max(0, goldenSteps.indexOf(screen) - 1)])
  }

  return <View className='shell'>
    <View className='phone'>
      <View className='statusbar'><Text>9:41</Text><Text className='status-icons'>● ◒</Text></View>
      {!['home', 'magic', 'sinkMagic', 'surfaceMagic'].includes(screen) && <View className='topbar'><Button className='icon-button' onClick={back} aria-label='返回'>‹</Button><Text className='wordmark'>下次一定</Text><View className='topbar-spacer' /></View>}

      {screen === 'home' && <View className='screen home'><View className='brand-row'><Text className='eyebrow'>NEXT TIME · ALPHA 03</Text><Text className='quiet'>•••</Text></View><View className='home-copy'><Text className='display'>我们</Text><Text className='lead'>那些说过的以后，{`\n`}会从这里开始。</Text></View><View className='empty-star'><Text>✦</Text><View className='waterline' /></View><Button className='primary' onClick={() => setScreen('say')}>说一个下次</Button><View className='nav'><Text className='active'>我们</Text><Text>后来</Text><Text>我</Text></View></View>}

      {screen === 'say' && <View className='screen form-screen'><Text className='eyebrow'>01 · 原话</Text><Text className='title'>说一个下次</Text><Text className='hint'>就写下你真正想对 TA 说的那句话。</Text><View className='field big'><Textarea maxlength={60} value={words} onInput={event => setWords(event.detail.value)} /></View><Text className='counter'>{words.length} / 60</Text><View className='spacer' /><Button className='primary' disabled={!words.trim()} onClick={() => setScreen('context')}>继续</Button></View>}

      {screen === 'context' && <View className='screen form-screen'><Text className='eyebrow'>02 · 可选</Text><Text className='title'>还想多留一点吗？</Text><Text className='hint'>这些只是帮助 TA 理解，不会改变你们要说算数的原话。</Text><View className='context-list'>{([['photo', '一张图片', '已选一张'], ['time', '大概什么时候', '天气暖一点'], ['place', '大概在哪里', '海边']] as const).map(([key, label, value]) => <Button key={key} className={context[key] ? 'context-row selected' : 'context-row'} onClick={() => toggleContext(key)}><Text>＋ {label}</Text><Text>{context[key] ? value : '可选'}</Text></Button>)}</View><View className='spacer' /><Button className='primary' onClick={() => setScreen('share')}>{Object.values(context).some(Boolean) ? '带上这些' : '跳过'}</Button></View>}

      {screen === 'share' && <View className='screen share-screen'><Text className='eyebrow'>说给谁听？</Text><Text className='share-quote'>{words}</Text><Text className='hint'>发给那个你想到的人。</Text><View className='wechat-card'><View className='share-wash' /><Text className='hollow-star'>☆</Text><Text className='card-kicker'>Yuki 说了一个下次</Text><Text className='card-quote'>“{words}”</Text><Text className='waiting-copy'>等你说算数。</Text><View className='card-footer'><Text>下次一定</Text><Text>打开看看 ›</Text></View></View><View className='spacer' /><Button className='wechat' loading={sending} onClick={share}>{sending ? '正在打开微信' : '发给微信朋友'}</Button></View>}

      {screen === 'answer' && <View className='screen answer-screen'><View className='perspective'><Text>微信分享模拟 · 接收方视角</Text></View><Text className='eyebrow'>YUKI 说了一个下次</Text><Text className='quote'>“{words}”</Text>{(context.time || context.place) && <View className='context-preview'>{context.time && <Text>大概：天气暖一点</Text>}{context.place && <Text>地点：海边</Text>}</View>}<View className='answer-copy'><Text className='title'>算数吗？</Text></View><View className='spacer' /><Button className='primary' onClick={accept}>算数</Button><Button className='text-button'>这次不算</Button></View>}

      {screen === 'magic' && <View className='screen magic' aria-live='polite'><View className='light-world'><View className='shallow-water' /><View className='falling-star'>✦</View><View className='ripple r1' /><View className='ripple r2' /></View><Text className='magic-title'>我们说好了。</Text><Text className='magic-sub'>这句话，留在了你们之间。</Text></View>}

      {screen === 'sinkMagic' && <View className='screen pool-magic' aria-live='polite'><View className='pool-scene'><View className='sunken-star'>✦</View><View className='soft-water w1' /><View className='soft-water w2' /></View><Text className='pool-magic-title'>它慢慢沉进了池里。</Text><Text className='pool-magic-sub'>没有消失，只是暂时安静下来。</Text></View>}
      {screen === 'surfaceMagic' && <View className='screen pool-magic surface-magic' aria-live='polite'><View className='pool-scene'><View className='rising-star'>✦</View><View className='soft-water w1' /><View className='soft-water w2' /></View><Text className='pool-magic-title'>捞起来了。</Text><Text className='pool-magic-sub'>它重新回到了你们的日常里。</Text></View>}

      {screen === 'relationship' && <View className='screen relationship'><Text className='eyebrow'>RELATIONSHIP</Text><Text className='title'>我和阿琳</Text><Text className='hint'>这里留着一些我们说过的话。</Text><View className='relationship-section'><Text className='section-label'>还在</Text>{commitment?.visibilityState === 'SURFACED' ? <Button className='commitment-row' onClick={() => setScreen('detail')}><Text className='commitment-star'>✦</Text><View className='commitment-copy'><Text className='commitment-words'>{words}</Text><Text className='commitment-status'>{commitment.signals.length ? 'Yuki：还想。' : '我们说好了 · 刚刚'}</Text></View><Text className='chevron'>›</Text></Button> : <Text className='section-empty'>现在没有等着发生的以后。</Text>}</View><Button className='pool-entry' onClick={() => setScreen('pool')}><View><Text className='section-label'>池</Text><Text className='pool-entry-copy'>{commitment?.visibilityState === 'SUNK' ? '有一句话正在池底安静着。' : '池里现在很安静。'}</Text></View><Text>看看池底 →</Text></Button><View className='relationship-section later-section'><Text className='section-label'>后来</Text><Text className='section-empty'>这里还没有后来。</Text></View><View className='spacer' /><Button className='secondary' onClick={() => setScreen('say')}>再说一个下次</Button></View>}

      {screen === 'pool' && <View className='screen pool-screen'><Text className='eyebrow'>我和阿琳</Text><Text className='title'>池</Text><Text className='hint'>有些以后，只是暂时沉到了时间里。</Text><View className={poolSelected ? 'spatial-pool has-selection' : 'spatial-pool'}>{['d1','d2','d3','d4','d5'].map(dot => <Button key={dot} className={`pool-dot ${dot}`} aria-label='池底的星星' />)}{commitment?.visibilityState === 'SUNK' && <Button className='pool-dot real-star' aria-label='查看沉下去的那句话' onClick={() => setPoolSelected(true)}>✦</Button>}{poolSelected && <View className='pool-selection'><Text className='selected-words'>{words}</Text><Text className='selected-meta'>这句话一直都在。</Text><Button className='lift-button' onClick={liftFromPool}>捞起来</Button><Button className='look-button' onClick={() => setPoolSelected(false)}>再看看</Button></View>}{commitment?.visibilityState !== 'SUNK' && <Text className='pool-empty-copy'>池里现在很安静。{`\n`}还没有什么沉到这里。</Text>}</View></View>}

      {screen === 'detail' && <View className='screen detail'><Text className='eyebrow'>我们说好的</Text><Text className='detail-quote'>{words}</Text><Text className='relationship-link'>我和阿琳</Text><View className='detail-star'>✦</View><View className='timeline'><Text className='timeline-title'>这句话的后来</Text><View className='event'><Text className='dot'>•</Text><View><Text>Yuki 说了这句话。</Text><Text className='date'>今天 · 09:41</Text></View></View><View className='event'><Text className='dot gold'>•</Text><View><Text>阿琳：算数。</Text><Text className='date'>刚刚</Text></View></View>{commitment?.signals.map(signal => <View className='event' key={signal.id}><Text className='dot apricot'>•</Text><View><Text>Yuki：还想。</Text><Text className='date'>刚刚</Text></View></View>)}</View>{signalFeedback && <Text className='signal-feedback'>已经留下：你还想。</Text>}<View className='spacer' /><Button className='secondary' onClick={wantStill}>{commitment?.signals.length ? '还想 · 已留下' : '还想'}</Button><Button className='primary disabled-preview'>来真的</Button><Text className='preview-label'>“还想”只表达现在的态度，不会移动这句话</Text></View>}
    </View>
    <View className='prototype-rail'><Text className='rail-title'>V3 · ALPHA 03</Text><Text>{stepIndex >= 0 ? `${String(stepIndex + 1).padStart(2, '0')} / ${String(goldenSteps.length).padStart(2, '0')}` : screen === 'surfaceMagic' ? 'POOL · M03' : screen === 'sinkMagic' ? 'POOL · M02' : 'V3 · SPACE'}</Text><View className='rail-track'><View className='rail-progress' style={{ height: `${stepIndex >= 0 ? ((stepIndex + 1) / goldenSteps.length) * 100 : 100}%` }} /></View>{commitment?.visibilityState === 'SURFACED' && screen !== 'surfaceMagic' && <Button className='rail-simulate' onClick={sinkForPrototype}>模拟时间流逝</Button>}<Button className='rail-reset' onClick={() => { setCommitment(null); setPoolSelected(false); setScreen('home') }}>重新开始</Button></View>
  </View>
}
