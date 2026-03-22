import { describe, expect, it, vi } from 'vitest'
import { createCounter } from '~/app/counter'

// In-source tests
if (import.meta.vitest) {
  describe('createCounter', () => {
    it('should initialize with default value 0', () => {
      const counter = createCounter()
      expect(counter.getCount()).toBe(0)
    })

    it('should initialize with custom value', () => {
      const counter = createCounter(10)
      expect(counter.getCount()).toBe(10)
    })

    it('should increment count by 1', () => {
      const counter = createCounter(5)
      counter.increment()
      expect(counter.getCount()).toBe(6)
    })

    it('should set count to specific value', () => {
      const counter = createCounter()
      counter.setCount(42)
      expect(counter.getCount()).toBe(42)
    })

    it('should call onCountChanged callback when incrementing', () => {
      const counter = createCounter()
      const callback = vi.fn()
      counter.onCountChanged(callback)

      counter.increment()
      expect(callback).toHaveBeenCalledWith(1)
    })

    it('should call onCountChanged callback when setting value', () => {
      const counter = createCounter()
      const callback = vi.fn()
      counter.onCountChanged(callback)

      counter.setCount(100)
      expect(callback).toHaveBeenCalledWith(100)
    })
  })
}
