import { createCounter } from './counter'
import './style.css'

function App() {
  let loading = true

  // Create counter instance
  const counter = createCounter()

  // Create button element
  const button = document.createElement('button')
  button.id = 'counter-btn'
  button.textContent = `Loading...`
  void counter.getCount().then((count) => {
    loading = false
    button.textContent = `Count is ${count}`
  })

  // Subscribe to count changes
  counter.onCountChanged((count) => {
    if (loading) {
      loading = false
    }
    button.textContent = `Count is ${count}`
  })

  // Handle button click
  button.addEventListener('click', () => {
    void counter.increment()
  })

  return {
    mount(target: HTMLElement) {
      target.appendChild(button)
    },
  }
}

const app = document.querySelector<HTMLDivElement>('#app')!
App().mount(app)
