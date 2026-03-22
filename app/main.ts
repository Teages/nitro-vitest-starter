import { createCounter } from './counter'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
  // Create counter instance
  const counter = createCounter()

  // Create button element
  const button = document.createElement('button')
  button.id = 'counter-btn'
  button.textContent = `Count is ${counter.getCount()}`

  // Subscribe to count changes
  counter.onCountChanged((count) => {
    button.textContent = `Count is ${count}`
  })

  // Handle button click
  button.addEventListener('click', () => {
    counter.increment()
  })

  app.appendChild(button)
}
