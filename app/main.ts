import { createCounter } from './counter'
import './style.css'

function App() {
  // Create counter instance
  const counter = createCounter()

  // Find existing button (SSR rendered) or create new one
  let button = document.querySelector<HTMLButtonElement>('#counter-btn')

  if (!button) {
    button = document.createElement('button')
    button.id = 'counter-btn'
    button.textContent = 'Loading...'
    const app = document.querySelector<HTMLDivElement>('#app')
    app?.appendChild(button)
  }

  // Subscribe to count changes
  counter.onCountChanged((count) => {
    button.textContent = `Count is ${count}`
  })

  // Fetch initial count to sync with server state
  void counter.getCount().then((count) => {
    button.textContent = `Count is ${count}`
  })

  // Handle button click
  button.addEventListener('click', () => {
    void counter.increment()
  })

  return {
    mount(target: HTMLElement) {
      if (!document.querySelector('#counter-btn')) {
        target.appendChild(button)
      }
    },
  }
}

// Only mount if #app exists and button not already in DOM
const app = document.querySelector<HTMLDivElement>('#app')
if (app) {
  App()
}
