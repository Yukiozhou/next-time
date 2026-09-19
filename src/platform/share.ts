export interface ShareAdapter {
  shareProposal(input: { words: string; recipient: string }): Promise<{ delivered: boolean }>
}

export const mockShareAdapter: ShareAdapter = {
  async shareProposal() {
    await new Promise(resolve => setTimeout(resolve, 450))
    return { delivered: true }
  },
}

// P2: provide a WeChat implementation without changing the domain or screen flow.
export const wechatShareAdapter: ShareAdapter = {
  async shareProposal() {
    throw new Error('Wechat share adapter is not configured yet')
  },
}
