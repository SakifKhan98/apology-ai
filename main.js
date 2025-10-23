const countEl = document.getElementById('count')
const btn = document.getElementById('sorryBtn')
const statusEl = document.getElementById('status')

async function fetchCount() {
  try {
    const res = await fetch('/.netlify/functions/counter')
    if (!res.ok) throw new Error('Failed to fetch count')
    const data = await res.json()
    renderCount(data.count)
  } catch (err) {
    statusEl.textContent = 'Could not load the current count. Retrying…'
    console.error(err)
  }
}

function renderCount(n) {
  countEl.textContent = new Intl.NumberFormat().format(n)
  countEl.classList.remove('bump')
  void countEl.offsetWidth // reflow to restart animation
  countEl.classList.add('bump')
}

btn.addEventListener('click', async () => {
  btn.disabled = true
  statusEl.textContent = 'Submitting your apology…'
  try {
    const res = await fetch('/.netlify/functions/counter', { method: 'POST' })
    if (!res.ok) throw new Error('Increment failed')
    const data = await res.json()
    renderCount(data.count)
    statusEl.textContent = 'Apology recorded. Thank you!'
  } catch (err) {
    console.error(err)
    statusEl.textContent = 'Something went wrong. Please try again.'
  } finally {
    btn.disabled = false
  }
})

fetchCount()
