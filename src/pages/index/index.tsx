import { useMemo, useState } from 'react'
import { Button, Input, Text, Textarea, View } from '@tarojs/components'
import { mockShareAdapter } from '../../platform/share'
import type { Commitment } from '../../domain/models'
import './index.scss'

type Screen = 'home' | 'say' | 'note' | 'person' | 'share' | 'answer' | 'magic' | 'relationship' | 'detail'

const steps: Screen[] = ['home', 'say', 'note', 'person', 'share', 'answer', 'magic', 'relationship', 'detail']

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home')
  const [words, setWords] = useState('下次一起去看海。')
  const [note, setNote] = useState('等天气暖一点，我们挑一个有风的下午。')
  const [recipient] = useState('阿琳')
  const [sending, setSending] = useState(false)
  const [commitment, setCommitment] = useState<Commitment | null>(null)
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

  return (
    <View className='shell'>
      <View className='phone'>
        <View className='statusbar'><Text>9:41</Text><Text className='status-icons'>● ◒</Text></View>
        {screen !== 'home' && screen !== 'magic' && (
          <View className='topbar'><Button className='icon-button' onClick={back} aria-label='返回'>‹</Button><Text className='wordmark'>下次一定</Text><View className='topbar-spacer' /></View>
        )}

        {screen === 'home' && (
          <View className='screen home'>
            <View className='brand-row'><Text className='eyebrow'>NEXT TIME · ALPHA 01</Text><Text className='quiet'>•••</Text></View>
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

        {screen === 'relationship' && (
          <View className='screen relationship'>
            <Text className='eyebrow'>RELATIONSHIP</Text><Text className='title'>我和阿琳</Text><Text className='hint'>我们之间，亮起了一个以后。</Text>
            <View className='tabs'><Text className='active'>还在 · 1</Text><Text>池 · 0</Text><Text>后来 · 0</Text></View>
            <Button className='commitment-card' onClick={() => setScreen('detail')}>
              <View className='commitment-star'>✦</View><View className='commitment-copy'><Text className='commitment-words'>{words}</Text><Text className='commitment-status'>{statusLabel} · 刚刚</Text></View><Text className='chevron'>›</Text>
            </Button>
            <View className='extension-note'><Text>这套结构已经为「池 / 还想 / 来真的 / 兑现 / 算啦 / 后来」保留状态入口。</Text></View>
            <View className='spacer' /><Button className='secondary' onClick={() => setScreen('say')}>再说一个下次</Button>
          </View>
        )}

        {screen === 'detail' && (
          <View className='screen detail'>
            <Text className='eyebrow'>我们说好的</Text><Text className='detail-quote'>{words}</Text><Text className='relationship-link'>我和阿琳</Text>
            <View className='detail-star'>✦</View>
            <View className='timeline'><Text className='timeline-title'>这句话的后来</Text><View className='event'><Text className='dot'>•</Text><View><Text>Yuki 说了这句话。</Text><Text className='date'>今天 · 09:41</Text></View></View><View className='event'><Text className='dot gold'>•</Text><View><Text>阿琳：算数。</Text><Text className='date'>刚刚</Text></View></View></View>
            <View className='spacer' /><Button className='secondary disabled-preview'>还想</Button><Button className='primary disabled-preview'>来真的</Button><Text className='preview-label'>后续 Alpha 将启用这些状态</Text>
          </View>
        )}
      </View>
      <View className='prototype-rail'><Text className='rail-title'>V3 · GOLDEN PATH</Text><Text>{String(stepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</Text><View className='rail-track'><View className='rail-progress' style={{ height: `${((stepIndex + 1) / steps.length) * 100}%` }} /></View><Button className='rail-reset' onClick={() => { setCommitment(null); setScreen('home') }}>重新开始</Button></View>
    </View>
  )
}
