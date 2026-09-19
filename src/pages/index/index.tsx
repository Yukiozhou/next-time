import { useMemo, useState } from 'react'
import { Button, Text, Textarea, View } from '@tarojs/components'
import { mockShareAdapter } from '../../platform/share'
import type { Commitment } from '../../domain/models'
import './index.scss'

type Screen = 'home' | 'say' | 'note' | 'person' | 'share' | 'answer' | 'magic' | 'relationship' | 'detail' | 'sinkMagic' | 'surfaceMagic'
type RelationshipTab = 'active' | 'pool' | 'later'

const steps: Screen[] = ['home', 'say', 'note', 'person', 'share', 'answer', 'magic', 'relationship', 'detail']

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home')
  const [words, setWords] = useState('下次一起去看海。')
  const [note, setNote] = useState('等天气暖一点，我们挑一个有风的下午。')
  const [recipient] = useState('阿琳')
  const [sending, setSending] = useState(false)
  const [commitment, setCommitment] = useState<Commitment | null>(null)
  const [relationshipTab, setRelationshipTab] = useState<RelationshipTab>('active')
  const [signalFeedback, setSignalFeedback] = useState(false)
  const stepIndex = steps.indexOf(screen)

  const statusLabel = useMemo(() => {
    if (!commitment) return '等待阿琳回应'
    return commitment.sharedState === 'SHARED' ? '我们说好了' : '待回应'
  }, [commitment])

  const share = async () => {
    setSending(true)
    const result = await mockShareAdapter.shareProposal({ words, recipient })
    setSending(false)
    if (result.delivered) setScreen('answer')
  }

  const accept = () => {
    setCommitment({
      id: 'commitment-alpha-01', relationshipId: 'yuki-alin', words, note,
      createdBy: 'yuki', sharedState: 'SHARED', visibilityState: 'SURFACED', signals: [],
      createdAt: new Date().toISOString(), sharedAt: new Date().toISOString(),
    })
    setScreen('magic')
    setTimeout(() => setScreen('relationship'), 2300)
  }

  const back = () => setScreen(steps[Math.max(0, stepIndex - 1)])

  const sinkForPrototype = () => {
    if (!commitment || commitment.visibilityState !== 'SURFACED') return
    setCommitment({ ...commitment, visibilityState: 'SUNK' })
    setScreen('sinkMagic')
    setTimeout(() => { setRelationshipTab('pool'); setScreen('relationship') }, 1700)
  }

  const wantStill = () => {
    if (!commitment) return
    setCommitment({
      ...commitment,
      visibilityState: 'SURFACED',
      signals: [...commitment.signals, {
        id: `signal-${Date.now()}`, type: 'WANT_STILL', actorId: 'yuki',
        visibility: 'SHARED', createdAt: new Date().toISOString(),
      }],
    })
    setSignalFeedback(true)
    if (commitment.visibilityState === 'SUNK') {
      setScreen('surfaceMagic')
      setTimeout(() => { setRelationshipTab('active'); setScreen('detail') }, 1700)
    } else {
      setTimeout(() => setSignalFeedback(false), 1800)
    }
  }

  return (
    <View className='shell'>
      <View className='phone'>
        <View className='statusbar'><Text>9:41</Text><Text className='status-icons'>● ◒</Text></View>
        {screen !== 'home' && screen !== 'magic' && screen !== 'sinkMagic' && screen !== 'surfaceMagic' && (
          <View className='topbar'><Button className='icon-button' onClick={back} aria-label='返回'>‹</Button><Text className='wordmark'>下次一定</Text><View className='topbar-spacer' /></View>
        )}

        {screen === 'home' && (
          <View className='screen home'>
            <View className='brand-row'><Text className='eyebrow'>NEXT TIME · ALPHA 02</Text><Text className='quiet'>•••</Text></View>
            <View className='home-copy'><Text className='display'>我们</Text><Text className='lead'>那些说过的以后，{`\n`}会从这里开始。</Text></View>
            <View className='empty-star'><Text>✦</Text><View className='waterline' /></View>
            <Button className='primary' onClick={() => setScreen('say')}>说一个下次</Button>
            <View className='nav'><Text className='active'>我们</Text><Text>后来</Text><Text>我</Text></View>
          </View>
        )}

        {screen === 'say' && (
          <View className='screen form-screen'>
            <Text className='eyebrow'>01 · 原话</Text><Text className='title'>说一个下次</Text>
            <Text className='hint'>就写下你真正想对 TA 说的那句话。</Text>
            <View className='field big'><Textarea maxlength={42} value={words} onInput={e => setWords(e.detail.value)} /></View>
            <Text className='counter'>{words.length} / 42</Text>
            <View className='spacer' /><Button className='primary' disabled={!words.trim()} onClick={() => setScreen('note')}>继续</Button>
          </View>
        )}

        {screen === 'note' && (
          <View className='screen form-screen'>
            <Text className='eyebrow'>02 · 可选</Text><Text className='title'>再多说一点？</Text>
            <Text className='hint'>可以留下一点当时的心情，也可以直接跳过。</Text>
            <View className='field'><Textarea maxlength={80} value={note} placeholder='比如：为什么会想起这件事' onInput={e => setNote(e.detail.value)} /></View>
            <View className='spacer' /><Button className='primary' onClick={() => setScreen('person')}>{note ? '带上这句话' : '跳过'}</Button>
          </View>
        )}

        {screen === 'person' && (
          <View className='screen form-screen'>
            <Text className='eyebrow'>03 · 关系</Text><Text className='title'>说给谁听？</Text>
            <View className='person-card'><View className='avatar'>琳</View><View><Text className='person-name'>阿琳</Text><Text className='person-meta'>你们还没有说好的“下次”</Text></View><Text className='check'>✓</Text></View>
            <View className='spacer' /><Button className='primary' onClick={() => setScreen('share')}>说给阿琳听</Button>
          </View>
        )}

        {screen === 'share' && (
          <View className='screen share-screen'>
            <Text className='eyebrow'>微信分享模拟</Text><Text className='title'>把这句话送过去</Text>
            <View className='wechat-card'><View className='mini-mark'>✦</View><Text className='card-kicker'>Yuki 说了一个下次</Text><Text className='card-quote'>“{words}”</Text><View className='card-footer'><Text>下次一定</Text><Text>打开看看 ›</Text></View></View>
            <Text className='fineprint'>Alpha 里用模拟分享验证体验；接入微信后由平台层替换。</Text>
            <View className='spacer' /><Button className='wechat' loading={sending} onClick={share}>{sending ? '正在送过去' : '模拟发送给阿琳'}</Button>
          </View>
        )}

        {screen === 'answer' && (
          <View className='screen answer-screen'>
            <View className='perspective'><Text>正在以</Text><Text className='avatar tiny'>琳</Text><Text>阿琳的视角查看</Text></View>
            <Text className='eyebrow'>YUKI 说</Text><Text className='quote'>“{words}”</Text>
            {note && <Text className='note'>{note}</Text>}
            <View className='answer-copy'><Text className='title'>算数吗？</Text><Text className='hint'>只有你也说算数，才会成为你们共同的以后。</Text></View>
            <View className='spacer' /><Button className='primary' onClick={accept}>算数</Button><Button className='text-button'>这次不算</Button>
          </View>
        )}

        {screen === 'magic' && (
          <View className='screen magic' aria-live='polite'>
            <View className='night'><View className='falling-star'>✦</View><View className='ripple r1' /><View className='ripple r2' /></View>
            <Text className='magic-title'>我们说好了。</Text><Text className='magic-sub'>一个人的以后，落进了两个人之间。</Text>
          </View>
        )}

        {screen === 'sinkMagic' && (
          <View className='screen pool-magic' aria-live='polite'>
            <View className='pool-scene'><View className='sunken-star'>✦</View><View className='soft-water w1' /><View className='soft-water w2' /></View>
            <Text className='pool-magic-title'>它慢慢沉进了池里。</Text><Text className='pool-magic-sub'>没有消失，只是暂时安静下来。</Text>
          </View>
        )}

        {screen === 'surfaceMagic' && (
          <View className='screen pool-magic surface-magic' aria-live='polite'>
            <View className='pool-scene'><View className='rising-star'>✦</View><View className='soft-water w1' /><View className='soft-water w2' /></View>
            <Text className='pool-magic-title'>你说：还想。</Text><Text className='pool-magic-sub'>这句话又浮到了你们之间。</Text>
          </View>
        )}

        {screen === 'relationship' && (
          <View className='screen relationship'>
            <Text className='eyebrow'>RELATIONSHIP</Text><Text className='title'>我和阿琳</Text><Text className='hint'>我们之间，亮起了一个以后。</Text>
            <View className='tabs'>
              <Text className={relationshipTab === 'active' ? 'active' : ''} onClick={() => setRelationshipTab('active')}>还在 · {commitment?.visibilityState === 'SURFACED' ? 1 : 0}</Text>
              <Text className={relationshipTab === 'pool' ? 'active' : ''} onClick={() => setRelationshipTab('pool')}>池 · {commitment?.visibilityState === 'SUNK' ? 1 : 0}</Text>
              <Text className={relationshipTab === 'later' ? 'active' : ''} onClick={() => setRelationshipTab('later')}>后来 · 0</Text>
            </View>
            {relationshipTab === 'active' && commitment?.visibilityState === 'SURFACED' && <Button className='commitment-card' onClick={() => setScreen('detail')}>
              <View className='commitment-star'>✦</View><View className='commitment-copy'><Text className='commitment-words'>{words}</Text><Text className='commitment-status'>{statusLabel} · {commitment.signals.length ? '你说还想' : '刚刚'}</Text></View><Text className='chevron'>›</Text>
            </Button>}
            {relationshipTab === 'active' && commitment?.visibilityState === 'SUNK' && <View className='quiet-empty'><Text className='empty-title'>现在没有等着发生的以后。</Text><Text>有一句话正在池里安静着。</Text></View>}
            {relationshipTab === 'pool' && commitment?.visibilityState === 'SUNK' && <View className='pool-panel'><View className='pool-glow' /><Button className='pool-card' onClick={() => setScreen('detail')}><Text className='pool-star'>✦</Text><Text className='pool-words'>{words}</Text><Text className='pool-meta'>沉在这里 · 轻点看看</Text></Button></View>}
            {relationshipTab === 'pool' && commitment?.visibilityState === 'SURFACED' && <View className='quiet-empty pool-empty'><Text className='empty-title'>池里现在很安静。</Text><Text>还没有什么沉到这里。</Text></View>}
            {relationshipTab === 'later' && <View className='quiet-empty'><Text className='empty-title'>这里还没有后来。</Text><Text>那些有了去处的话，会留在这里。</Text></View>}
            <View className='spacer' /><Button className='secondary' onClick={() => setScreen('say')}>再说一个下次</Button>
          </View>
        )}

        {screen === 'detail' && (
          <View className='screen detail'>
            <Text className='eyebrow'>我们说好的</Text><Text className='detail-quote'>{words}</Text><Text className='relationship-link'>我和阿琳</Text>
            <View className={commitment?.visibilityState === 'SUNK' ? 'detail-star sunk' : 'detail-star'}>✦</View>
            {commitment?.visibilityState === 'SUNK' && <View className='sunk-notice'><Text>它在池里安静了一阵。</Text><Text>如果你还想，就让它重新浮起来。</Text></View>}
            <View className='timeline'><Text className='timeline-title'>这句话的后来</Text><View className='event'><Text className='dot'>•</Text><View><Text>Yuki 说了这句话。</Text><Text className='date'>今天 · 09:41</Text></View></View><View className='event'><Text className='dot gold'>•</Text><View><Text>阿琳：算数。</Text><Text className='date'>刚刚</Text></View></View></View>
            {signalFeedback && commitment?.visibilityState === 'SURFACED' && <Text className='signal-feedback'>你说：还想。</Text>}
            <View className='spacer' /><Button className='secondary' onClick={wantStill}>{commitment?.visibilityState === 'SUNK' ? '我还想' : commitment?.signals.length ? '还想 · 已留下' : '还想'}</Button><Button className='primary disabled-preview'>来真的</Button><Text className='preview-label'>{commitment?.visibilityState === 'SUNK' ? '“还想”会把它从池里捞起来' : '“还想”只表达态度，不等于来真的'}</Text>
          </View>
        )}
      </View>
      <View className='prototype-rail'><Text className='rail-title'>V3 · ALPHA 02</Text><Text>{stepIndex >= 0 ? `${String(stepIndex + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}` : screen === 'surfaceMagic' ? 'POOL · M03' : 'POOL · M02'}</Text><View className='rail-track'><View className='rail-progress' style={{ height: `${stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 100}%` }} /></View>{commitment?.visibilityState === 'SURFACED' && screen !== 'surfaceMagic' && <Button className='rail-simulate' onClick={sinkForPrototype}>模拟时间流逝</Button>}<Button className='rail-reset' onClick={() => { setCommitment(null); setRelationshipTab('active'); setScreen('home') }}>重新开始</Button></View>
    </View>
  )
}
