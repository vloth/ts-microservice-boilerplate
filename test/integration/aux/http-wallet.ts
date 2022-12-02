export function wallet(url: string) {
  return {
    history: () =>
      fetch(`${url}/wallet/history`)
        .then(res => res.json()),

    deposit: (btc: number) =>
      fetch(`${url}/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ btc })
      }).then(res => res.json()),

    withdraw: (btc: number) =>
      fetch(`${url}/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ btc })
      }).then(res => res.json())
  }
}
